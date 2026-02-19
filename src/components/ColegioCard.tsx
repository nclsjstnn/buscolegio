import type { Colegio } from '@/data/colegios'

const TIPO_CONFIG = {
  municipal: {
    label: 'Municipal',
    badge: 'bg-blue-100 text-blue-700',
    accent: 'bg-blue-700',
  },
  subvencionado: {
    label: 'Subvencionado',
    badge: 'bg-emerald-100 text-emerald-700',
    accent: 'bg-emerald-600',
  },
  particular: {
    label: 'Particular',
    badge: 'bg-violet-100 text-violet-700',
    accent: 'bg-violet-600',
  },
} as const

const NIVEL_LABEL: Record<Colegio['nivel'], string> = {
  'básica': 'Básica',
  'media': 'Media',
  'básica y media': 'Básica y Media',
}

function formatPesos(amount: number): string {
  if (amount === 0) return 'Gratuito'
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(amount)
}

function StarsRating({ rating }: { rating: number }) {
  const filled = Math.round(rating)
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={`text-base leading-none ${i < filled ? 'text-amber-400' : 'text-gray-200'}`}
        >
          ★
        </span>
      ))}
      <span className="ml-1.5 text-sm font-medium text-gray-500">{rating.toFixed(1)}</span>
    </div>
  )
}

export default function ColegioCard({ colegio }: { colegio: Colegio }) {
  const tipo = TIPO_CONFIG[colegio.tipo]
  const esGratuito = colegio.mensualidad === 0

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Franja de color según tipo */}
      <div className={`h-1.5 w-full ${tipo.accent}`} />

      <div className="flex flex-col flex-1 p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${tipo.badge}`}>
            {tipo.label}
          </span>
          <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
            {NIVEL_LABEL[colegio.nivel]}
          </span>
        </div>

        {/* Nombre */}
        <h2 className="text-base font-semibold text-gray-900 leading-snug mb-2">
          {colegio.nombre}
        </h2>

        {/* Rating */}
        <StarsRating rating={colegio.rating} />

        {/* Detalles */}
        <dl className="mt-4 space-y-2 flex-1">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-gray-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <dd className="text-sm text-gray-600">
              {colegio.comuna},{' '}
              {colegio.region === 'Metropolitana'
                ? 'Región Metropolitana'
                : `Región de ${colegio.region}`}
            </dd>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
              </svg>
            </span>
            <dd className="text-sm text-gray-600">
              {colegio.alumnos.toLocaleString('es-CL')} alumnos
            </dd>
          </div>
        </dl>

        {/* Mensualidad + CTA */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Mensualidad</p>
            <p className={`text-sm font-semibold truncate ${esGratuito ? 'text-emerald-600' : 'text-gray-900'}`}>
              {formatPesos(colegio.mensualidad)}
            </p>
          </div>
          <button
            type="button"
            className="shrink-0 bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150 cursor-pointer"
          >
            Ver más
          </button>
        </div>
      </div>
    </article>
  )
}
