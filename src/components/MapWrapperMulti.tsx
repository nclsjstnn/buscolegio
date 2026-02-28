'use client'

import dynamic from 'next/dynamic'
import type { GeoPoint } from './MapComponentMulti'

const MapComponentMulti = dynamic(() => import('@/components/MapComponentMulti'), { ssr: false })

export default function MapWrapperMulti({ colegios, hasFilters }: { colegios: GeoPoint[]; hasFilters: boolean }) {
  return <MapComponentMulti colegios={colegios} hasFilters={hasFilters} />
}
