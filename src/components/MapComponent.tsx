'use client'

import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
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

interface MapComponentProps {
  lat: number
  lng: number
  nombre: string
}

export default function MapComponent({ lat, lng, nombre }: MapComponentProps) {
  useEffect(() => {
    L.Marker.prototype.options.icon = defaultIcon
  }, [])

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: '400px', width: '100%', borderRadius: '12px' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={defaultIcon}>
        <Popup>{nombre}</Popup>
      </Marker>
    </MapContainer>
  )
}
