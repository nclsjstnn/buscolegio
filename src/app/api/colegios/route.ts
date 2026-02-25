import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Establecimiento from '@/models/Establecimiento'
import type { IEstablecimiento } from '@/models/Establecimiento'

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim() ?? ''
  const region = searchParams.get('region') ?? ''
  const tipo = searchParams.get('tipo') ?? ''
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const skip = (page - 1) * limit

  const filter: Record<string, unknown> = { estadoCodigo: 1 }

  if (q) {
    filter.$or = [
      { nombre: { $regex: q, $options: 'i' } },
      { comuna: { $regex: q, $options: 'i' } },
    ]
  }
  if (region) filter.regionCodigo = parseInt(region, 10)
  if (tipo) filter.dependencia2Codigo = parseInt(tipo, 10)

  const [total, docs] = await Promise.all([
    Establecimiento.countDocuments(filter),
    Establecimiento.find(filter)
      .select('rbd nombre dependencia2 dependencia2Codigo region regionCodigo comuna mat_total pagoMensual nivelesEnsenianza rural')
      .sort({ nombre: 1 })
      .skip(skip)
      .limit(limit)
      .lean(),
  ])

  return NextResponse.json({ total, page, limit, colegios: docs })
}
