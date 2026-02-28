import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Establecimiento from '@/models/Establecimiento'

export async function GET(req: NextRequest) {
  await connectDB()

  const { searchParams } = req.nextUrl
  const q = searchParams.get('q')?.trim() ?? ''
  const region = searchParams.get('region') ?? ''
  const tipo = searchParams.get('tipo') ?? ''

  const filter: Record<string, unknown> = {
    estadoCodigo: 1,
    latitud: { $ne: 0 },
    longitud: { $ne: 0 },
  }

  if (q) {
    filter.$or = [
      { nombre: { $regex: q, $options: 'i' } },
      { comuna: { $regex: q, $options: 'i' } },
    ]
  }
  if (region) filter.regionCodigo = parseInt(region, 10)
  if (tipo) filter.dependencia2Codigo = parseInt(tipo, 10)

  const [total, colegios] = await Promise.all([
    Establecimiento.countDocuments(filter),
    Establecimiento.find(filter)
      .select('rbd nombre latitud longitud dependencia2Codigo')
      .sort({ nombre: 1 })
      .limit(500)
      .lean(),
  ])

  return NextResponse.json({ total, colegios })
}
