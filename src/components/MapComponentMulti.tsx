'use client'

import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix default icon paths broken by Webpack
const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

export interface GeoPoint {
  rbd: number
  nombre: string
  latitud: number
  longitud: number
  dependencia2Codigo: number
}

// Centro aproximado de la comuna de Providencia, Santiago
const PROVIDENCIA: [number, number] = [-33.4329, -70.6097]

function BoundsAdjuster({ colegios, hasFilters }: { colegios: GeoPoint[]; hasFilters: boolean }) {
  const map = useMap()
  const initialViewSet = useRef(false)

  useEffect(() => {
    if (!hasFilters) {
      if (!initialViewSet.current) {
        initialViewSet.current = true
        map.setView(PROVIDENCIA, 14)
      }
      return
    }
    if (colegios.length === 0) return
    const bounds = L.latLngBounds(colegios.map((c) => [c.latitud, c.longitud]))
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 })
  }, [colegios, map, hasFilters])

  return null
}

interface MapComponentMultiProps {
  colegios: GeoPoint[]
  hasFilters: boolean
}

export default function MapComponentMulti({ colegios, hasFilters }: MapComponentMultiProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon
  }, [])

  return (
    <MapContainer
      center={PROVIDENCIA}
      zoom={14}
      style={{ height: '450px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <BoundsAdjuster colegios={colegios} hasFilters={hasFilters} />
      {colegios.map((c) => (
        <Marker key={c.rbd} position={[c.latitud, c.longitud]} icon={defaultIcon}>
          <Popup>
            <strong>{c.nombre}</strong>
            <br />
            <a href={`/colegios/${c.rbd}`} className="text-blue-700 underline text-sm">
              Ver detalle
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
