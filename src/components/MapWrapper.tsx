'use client'

import dynamic from 'next/dynamic'

const MapComponent = dynamic(() => import('@/components/MapComponent'), { ssr: false })

export default function MapWrapper({ lat, lng, nombre }: { lat: number; lng: number; nombre: string }) {
  return <MapComponent lat={lat} lng={lng} nombre={nombre} />
}
