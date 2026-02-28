'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import ColegioCard from '@/components/ColegioCard'
import type { ColegioCardData } from '@/components/ColegioCard'
import SiteFooter from '@/components/SiteFooter'
import MapWrapperMulti from '@/components/MapWrapperMulti'
import type { GeoPoint } from '@/components/MapComponentMulti'

const REGIONES = [
  { value: '15', label: 'Arica y Parinacota' },
  { value: '1', label: 'Tarapacá' },
  { value: '2', label: 'Antofagasta' },
  { value: '3', label: 'Atacama' },
  { value: '4', label: 'Coquimbo' },
  { value: '5', label: 'Valparaíso' },
  { value: '13', label: 'Metropolitana' },
  { value: '6', label: "O'Higgins" },
  { value: '7', label: 'Maule' },
  { value: '16', label: 'Ñuble' },
  { value: '8', label: 'Biobío' },
  { value: '9', label: 'La Araucanía' },
  { value: '14', label: 'Los Ríos' },
  { value: '10', label: 'Los Lagos' },
  { value: '11', label: 'Aysén' },
  { value: '12', label: 'Magallanes' },
]

const TIPOS = [
  { value: '1', label: 'Municipal' },
  { value: '2', label: 'Particular Subvencionado' },
  { value: '3', label: 'Particular Pagado' },
  { value: '4', label: 'Corp. Adm. Delegada' },
  { value: '5', label: 'Serv. Local Educación' },
]

const SELECT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'

interface ApiResponse {
  total: number
  page: number
  limit: number
  colegios: ColegioCardData[]
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div className="h-1.5 w-full bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="flex gap-2">
          <div className="h-5 w-20 bg-gray-200 rounded-full" />
          <div className="h-5 w-24 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-1/2 bg-gray-200 rounded" />
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="h-4 w-16 bg-gray-200 rounded" />
          <div className="h-8 w-20 bg-gray-200 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [busqueda, setBusqueda] = useState(() => searchParams.get('q') ?? '')
  const [region, setRegion] = useState(() => searchParams.get('region') ?? '')
  const [tipo, setTipo] = useState(() => searchParams.get('tipo') ?? '')
  const [page, setPage] = useState(() => Number(searchParams.get('page') ?? '1'))
  const [data, setData] = useState<ApiResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [debouncedBusqueda, setDebouncedBusqueda] = useState(() => searchParams.get('q') ?? '')
  const [mapData, setMapData] = useState<GeoPoint[]>([])
  const [mapTotal, setMapTotal] = useState(0)

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedBusqueda(busqueda), 400)
    return () => clearTimeout(t)
  }, [busqueda])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [debouncedBusqueda, region, tipo])

  // Sync URL with committed filters
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedBusqueda) params.set('q', debouncedBusqueda)
    if (region) params.set('region', region)
    if (tipo) params.set('tipo', tipo)
    if (page > 1) params.set('page', String(page))
    const qs = params.toString()
    router.replace(qs ? `/?${qs}` : '/', { scroll: false })
  }, [debouncedBusqueda, region, tipo, page, router])

  const fetchColegios = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (debouncedBusqueda) params.set('q', debouncedBusqueda)
      if (region) params.set('region', region)
      if (tipo) params.set('tipo', tipo)

      const res = await fetch(`/api/colegios?${params}`)
      if (res.ok) {
        setData(await res.json())
      }
    } finally {
      setLoading(false)
    }
  }, [debouncedBusqueda, region, tipo, page])

  const fetchGeo = useCallback(async () => {
    const params = new URLSearchParams()
    if (debouncedBusqueda) params.set('q', debouncedBusqueda)
    if (region) params.set('region', region)
    if (tipo) params.set('tipo', tipo)
    const res = await fetch(`/api/colegios/geo?${params}`)
    if (res.ok) {
      const json = await res.json()
      setMapData(json.colegios)
      setMapTotal(json.total)
    }
  }, [debouncedBusqueda, region, tipo])

  useEffect(() => {
    fetchColegios()
    fetchGeo()
  }, [fetchColegios, fetchGeo])

  const hayFiltros = !!(busqueda || region || tipo)

  function limpiarFiltros() {
    setBusqueda('')
    setRegion('')
    setTipo('')
    setPage(1)
  }

  const totalPages = data ? Math.ceil(data.total / data.limit) : 0

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-blue-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center">
          <a href="/" className="flex items-baseline gap-0.5 group">
            <span className="text-white text-xl font-bold tracking-tight group-hover:opacity-90 transition-opacity">
              buscolegio
            </span>
            <span className="text-blue-300 text-sm font-medium">.com</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-800 to-blue-900 pb-20 pt-12 md:pt-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight mb-4">
              Encuentra el colegio ideal<br className="hidden sm:block" /> para tu familia
            </h1>
            <p className="text-blue-200 text-base sm:text-lg max-w-xl mx-auto">
              Compara colegios de todo Chile por tipo, nivel educacional, ubicación y mensualidad.
            </p>
          </div>

          {/* Search card */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            <div className="relative mb-4">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Busca por nombre de colegio o comuna…"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 text-gray-900 placeholder-gray-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="filtro-region" className="sr-only">Región</label>
                <select
                  id="filtro-region"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Todas las regiones</option>
                  {REGIONES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filtro-tipo" className="sr-only">Tipo de colegio</label>
                <select
                  id="filtro-tipo"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Tipo de colegio</option>
                  {TIPOS.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mapa */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 -mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <MapWrapperMulti colegios={mapData} hasFilters={hayFiltros} />
          {mapTotal > mapData.length && (
            <p className="text-xs text-gray-400 text-center py-2">
              Mostrando {mapData.length} de {mapTotal.toLocaleString('es-CL')} colegios en el mapa
            </p>
          )}
        </div>
      </section>

      {/* Results */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            {loading ? (
              <span className="inline-block h-4 w-32 bg-gray-200 rounded animate-pulse" />
            ) : (
              <>
                <span className="font-semibold text-gray-900 text-base">{data?.total.toLocaleString('es-CL') ?? 0}</span>
                {' '}
                {data?.total === 1 ? 'colegio encontrado' : 'colegios encontrados'}
              </>
            )}
          </p>
          {hayFiltros && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="text-sm text-blue-700 hover:text-blue-800 font-medium underline underline-offset-2 transition-colors cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data && data.colegios.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {data.colegios.map((colegio) => (
                <ColegioCard key={colegio.rbd} colegio={colegio} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="text-sm text-gray-600">
                  Página {page} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="text-5xl mb-5" aria-hidden="true">🏫</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              No encontramos colegios
            </h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              Prueba ajustando los filtros o buscando con otras palabras.
            </p>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="bg-blue-800 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors duration-150 cursor-pointer"
            >
              Ver todos los colegios
            </button>
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense>
      <HomeContent />
    </Suspense>
  )
}
