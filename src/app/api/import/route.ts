import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs'
import { parse } from 'csv-parse'
import { connectDB } from '@/lib/mongodb'
import Establecimiento from '@/models/Establecimiento'
import {
  DEPENDENCIA,
  DEPENDENCIA2,
  ENSEÑANZA,
  ESPECIALIDAD,
  ORIENTACION_RELIGIOSA,
  ESTADO,
  REGION,
} from '@/lib/codigos'

const CSV_PATH = path.join(
  process.cwd(),
  'Directorio-Oficial-EE-2025',
  '20250926_Directorio_Oficial_EE_2025_20250430_WEB.csv',
)

const BATCH_SIZE = 500

type CsvRow = Record<string, string>

function toInt(v: string): number {
  const n = parseInt(v, 10)
  return isNaN(n) ? 0 : n
}

function toFloat(v: string): number {
  if (!v || v.trim() === '') return 0
  const n = parseFloat(v.replace(',', '.'))
  return isNaN(n) ? 0 : n
}

function buildOps(rows: CsvRow[]) {
  return rows.map((row) => {
    const ensCodes = [
      row.ENS_01, row.ENS_02, row.ENS_03, row.ENS_04, row.ENS_05,
      row.ENS_06, row.ENS_07, row.ENS_08, row.ENS_09, row.ENS_10, row.ENS_11,
    ].map(toInt).filter((c) => c !== 0)

    const nivelesEnsenianza = ensCodes.map((c) => ENSEÑANZA[c] ?? `Código ${c}`)

    const espeCodes = [
      row.ESPE_01, row.ESPE_02, row.ESPE_03, row.ESPE_04, row.ESPE_05,
      row.ESPE_06, row.ESPE_07, row.ESPE_08, row.ESPE_09, row.ESPE_10, row.ESPE_11,
    ].map(toInt).filter((c) => c !== 0)

    const especialidades = espeCodes.map((c) => ESPECIALIDAD[c] ?? `Código ${c}`)

    const depCodigo = toInt(row.COD_DEPE)
    const dep2Codigo = toInt(row.COD_DEPE2)
    const regCodigo = toInt(row.COD_REG_RBD)
    const estadoCodigo = toInt(row.ESTADO_ESTAB)
    const oriCodigo = toInt(row.ORI_RELIGIOSA)

    const doc = {
      rbd: toInt(row.RBD),
      nombre: (row.NOM_RBD ?? '').trim(),
      agno: toInt(row.AGNO),
      dependenciaCodigo: depCodigo,
      dependencia: DEPENDENCIA[depCodigo] ?? `Código ${depCodigo}`,
      dependencia2Codigo: dep2Codigo,
      dependencia2: DEPENDENCIA2[dep2Codigo] ?? `Código ${dep2Codigo}`,
      regionCodigo: regCodigo,
      region: REGION[regCodigo] ?? row.NOM_REG_RBD_A ?? `Región ${regCodigo}`,
      provinciaCodigo: toInt(row.COD_PRO_RBD),
      comunaCodigo: toInt(row.COD_COM_RBD),
      comuna: (row.NOM_COM_RBD ?? '').trim(),
      deprovCodigo: toInt(row.COD_DEPROV_RBD),
      deprov: (row.NOM_DEPROV_RBD ?? '').trim(),
      rural: row.RURAL_RBD === '1',
      latitud: toFloat(row.LATITUD),
      longitud: toFloat(row.LONGITUD),
      convenio_pie: row.CONVENIO_PIE === '1',
      pace: row.PACE === '1',
      nivelesEnsenianza,
      mat_parvulario: toInt(row.MAT_ENS_1),
      mat_basicaRegular: toInt(row.MAT_ENS_2),
      mat_basicaAdulto: toInt(row.MAT_ENS_3),
      mat_especial: toInt(row.MAT_ENS_4),
      mat_mediaHCJovenes: toInt(row.MAT_ENS_5),
      mat_mediaHCAdultos: toInt(row.MAT_ENS_6),
      mat_mediaTPJovenes: toInt(row.MAT_ENS_7),
      mat_mediaTPAdultos: toInt(row.MAT_ENS_8),
      mat_total: toInt(row.MAT_TOTAL),
      tieneMatricula: row.MATRICULA === '1',
      estadoCodigo,
      estado: ESTADO[estadoCodigo] ?? `Estado ${estadoCodigo}`,
      orientacionReligiosaCodigo: oriCodigo,
      orientacionReligiosa: ORIENTACION_RELIGIOSA[oriCodigo] ?? `Código ${oriCodigo}`,
      orientacionReligiosaGlosa: (row.ORI_OTRO_GLOSA ?? '').trim(),
      pagoMatricula: (row.PAGO_MATRICULA ?? '').trim(),
      pagoMensual: (row.PAGO_MENSUAL ?? '').trim(),
      especialidades,
    }

    return {
      updateOne: {
        filter: { rbd: doc.rbd },
        update: { $set: doc },
        upsert: true,
      },
    }
  })
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-import-secret')
  if (secret !== (process.env.IMPORT_SECRET ?? 'dev-secret')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!fs.existsSync(CSV_PATH)) {
    return NextResponse.json({ error: `CSV not found at ${CSV_PATH}` }, { status: 404 })
  }

  await connectDB()

  return new Promise<NextResponse>((resolve) => {
    let imported = 0
    const errors: string[] = []
    let batch: CsvRow[] = []

    async function flushBatch() {
      if (batch.length === 0) return
      try {
        const ops = buildOps(batch)
        await Establecimiento.bulkWrite(ops, { ordered: false })
        imported += batch.length
      } catch (err) {
        errors.push(String(err))
      }
      batch = []
    }

    const parser = parse({
      delimiter: ';',
      columns: true,
      bom: true,
      trim: true,
      relax_column_count: true,
    })

    parser.on('readable', async () => {
      let record: CsvRow
      while ((record = parser.read()) !== null) {
        batch.push(record)
        if (batch.length >= BATCH_SIZE) {
          parser.pause()
          await flushBatch()
          parser.resume()
        }
      }
    })

    parser.on('error', (err) => {
      resolve(NextResponse.json({ error: err.message }, { status: 500 }))
    })

    parser.on('end', async () => {
      await flushBatch()
      resolve(NextResponse.json({ imported, errors }))
    })

    fs.createReadStream(CSV_PATH).pipe(parser)
  })
}
