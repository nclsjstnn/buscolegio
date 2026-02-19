'use client'

import { useState, useMemo } from 'react'
import { colegios } from '@/data/colegios'
import type { TipoColegio, NivelColegio } from '@/data/colegios'
import ColegioCard from '@/components/ColegioCard'

const REGIONES = ['Metropolitana', 'Valparaíso', 'Biobío'] as const

const TIPOS: { value: TipoColegio; label: string }[] = [
  { value: 'municipal', label: 'Municipal' },
  { value: 'subvencionado', label: 'Subvencionado' },
  { value: 'particular', label: 'Particular' },
]

const NIVELES: { value: NivelColegio; label: string }[] = [
  { value: 'básica', label: 'Básica (1° a 8°)' },
  { value: 'media', label: 'Media (1° a 4°M)' },
  { value: 'básica y media', label: 'Básica y Media' },
]

const SELECT_CLASS =
  'w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer'

export default function Home() {
  const [busqueda, setBusqueda] = useState('')
  const [region, setRegion] = useState('')
  const [tipo, setTipo] = useState('')
  const [nivel, setNivel] = useState('')

  const resultados = useMemo(() => {
    const q = busqueda.toLowerCase().trim()
    return colegios.filter((c) => {
      const matchBusqueda =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        c.comuna.toLowerCase().includes(q)

      const matchRegion = !region || c.region === region
      const matchTipo = !tipo || c.tipo === tipo

      // Un colegio "básica y media" aparece en cualquier filtro de nivel
      const matchNivel =
        !nivel ||
        c.nivel === nivel ||
        (nivel !== 'básica y media' && c.nivel === 'básica y media')

      return matchBusqueda && matchRegion && matchTipo && matchNivel
    })
  }, [busqueda, region, tipo, nivel])

  const hayFiltros = !!(busqueda || region || tipo || nivel)

  function limpiarFiltros() {
    setBusqueda('')
    setRegion('')
    setTipo('')
    setNivel('')
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Header ────────────────────────────────────── */}
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

      {/* ── Hero ──────────────────────────────────────── */}
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

          {/* Tarjeta de búsqueda */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6">
            {/* Input principal */}
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

            {/* Filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                    <option key={r} value={r}>
                      {r === 'Metropolitana' ? 'Región Metropolitana' : `Región de ${r}`}
                    </option>
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

              <div>
                <label htmlFor="filtro-nivel" className="sr-only">Nivel educacional</label>
                <select
                  id="filtro-nivel"
                  value={nivel}
                  onChange={(e) => setNivel(e.target.value)}
                  className={SELECT_CLASS}
                >
                  <option value="">Nivel educacional</option>
                  {NIVELES.map((n) => (
                    <option key={n.value} value={n.value}>{n.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resultados ────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {/* Cabecera de resultados */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-900 text-base">{resultados.length}</span>
            {' '}
            {resultados.length === 1 ? 'colegio encontrado' : 'colegios encontrados'}
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

        {/* Grid de cards */}
        {resultados.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {resultados.map((colegio) => (
              <ColegioCard key={colegio.id} colegio={colegio} />
            ))}
          </div>
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

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="border-t border-gray-200 bg-white mt-10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} buscolegio.com — Ayudando a las familias chilenas a elegir el mejor colegio
          </p>
        </div>
      </footer>
    </div>
  )
}
