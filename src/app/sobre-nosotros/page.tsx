import type { Metadata } from 'next'
import Link from 'next/link'
import SiteFooter from '@/components/SiteFooter'

export const metadata: Metadata = {
  title: 'Sobre nosotros — buscolegio.com',
  description: 'Conoce el origen de buscolegio.com, el directorio de colegios chilenos construido con vibe coding y Claude Code.',
}

export default function SobreNosotros() {
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Hero */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sobre buscolegio.com</h1>
        <p className="text-gray-500 mb-10">El directorio de colegios chilenos construido con vibe coding</p>

        {/* ¿Qué es? */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">¿Qué es buscolegio.com?</h2>
          <p className="text-gray-600 leading-relaxed">
            buscolegio.com es un directorio que reúne los{' '}
            <strong>16.768 establecimientos educacionales</strong> de Chile con datos
            oficiales del Ministerio de Educación (Mineduc) 2025. Permite buscar colegios
            por nombre o comuna, filtrar por región y tipo de dependencia, ver la ficha
            completa de cada establecimiento con mapa, niveles de enseñanza, matrículas
            y reseñas de la comunidad.
          </p>
        </section>

        {/* Vibe coding */}
        <section className="mb-10 bg-blue-50 border border-blue-100 rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-3">Vibecodeado con Claude Code</h2>
          <p className="text-blue-800 leading-relaxed mb-4">
            Este sitio fue construido <strong>100% con vibe coding</strong> usando{' '}
            <a
              href="https://claude.ai/code"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-blue-600"
            >
              Claude Code
            </a>
            {' '}— el agente de programación de Anthropic. Cada componente, API, consulta
            a base de datos y decisión de diseño fue generado describiendo en lenguaje
            natural lo que se quería lograr.
          </p>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>
              <span className="font-medium">Stack:</span>{' '}
              Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, MongoDB/Mongoose
            </li>
            <li>
              <span className="font-medium">Datos:</span>{' '}
              CSV oficial Mineduc 2025 — 16.768 establecimientos educacionales
            </li>
            <li>
              <span className="font-medium">Features:</span>{' '}
              búsqueda con filtros, fichas de colegio, mapa Leaflet, sistema de reviews con localStorage, enriquecimiento con Google Places API
            </li>
            <li>
              <span className="font-medium">Tiempo:</span>{' '}
              construido en pocas sesiones de vibe coding
            </li>
          </ul>
        </section>

        {/* ¿Qué es vibe coding? */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">¿Qué es el vibe coding?</h2>
          <p className="text-gray-600 leading-relaxed">
            El vibe coding es una forma de programar en la que describes en lenguaje
            natural lo que quieres construir y un agente de IA como Claude Code genera
            el código por ti. No reemplaza el criterio del desarrollador — sigue siendo
            necesario revisar, iterar y tomar decisiones — pero elimina la fricción de
            escribir código repetitivo y permite construir productos funcionales mucho
            más rápido.
          </p>
        </section>

        {/* Fuente de datos */}
        <section className="mb-10">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Fuente de datos</h2>
          <p className="text-gray-600 leading-relaxed">
            Los datos de establecimientos provienen del{' '}
            <strong>Directorio Oficial de Establecimientos Educacionales 2025</strong>{' '}
            publicado por el Ministerio de Educación de Chile (Mineduc). La información
            incluye nombre, dirección, comuna, región, dependencia administrativa,
            niveles de enseñanza, matrículas y coordenadas geográficas.
          </p>
        </section>

        <div className="border-t border-gray-200 pt-8 text-center">
          <Link
            href="/"
            className="inline-block bg-blue-800 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors duration-150"
          >
            Buscar colegios
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
