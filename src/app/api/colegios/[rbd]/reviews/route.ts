import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Review from '@/models/Review'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ rbd: string }> },
) {
  const { rbd } = await params
  const rbdNum = parseInt(rbd, 10)
  if (isNaN(rbdNum)) {
    return NextResponse.json({ error: 'Invalid RBD' }, { status: 400 })
  }

  await connectDB()

  const reviews = await Review.find({ rbd: rbdNum }).sort({ fecha: -1 }).lean()
  const total = reviews.length
  const avgRating =
    total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : null

  return NextResponse.json({ reviews, total, avgRating })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ rbd: string }> },
) {
  const { rbd } = await params
  const rbdNum = parseInt(rbd, 10)
  if (isNaN(rbdNum)) {
    return NextResponse.json({ error: 'Invalid RBD' }, { status: 400 })
  }

  const body = await req.json()
  const { rating, texto } = body as { rating: unknown; texto: unknown }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'rating debe ser un número entre 1 y 5' }, { status: 400 })
  }
  if (typeof texto !== 'string' || texto.trim().length < 10) {
    return NextResponse.json({ error: 'texto debe tener al menos 10 caracteres' }, { status: 400 })
  }

  await connectDB()

  const review = await Review.create({ rbd: rbdNum, rating, texto: texto.trim() })

  return NextResponse.json({ review }, { status: 201 })
}
