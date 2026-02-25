import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Establecimiento from '@/models/Establecimiento'

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

  const doc = await Establecimiento.findOne({ rbd: rbdNum }).lean()
  if (!doc) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(doc)
}
