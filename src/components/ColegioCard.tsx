import Link from 'next/link'

const DEPENDENCIA2_CONFIG: Record<number, { label: string; badge: string; accent: string }> = {
  1: { label: 'Municipal', badge: 'bg-blue-100 text-blue-700', accent: 'bg-blue-700' },
  2: { label: 'Particular Subvencionado', badge: 'bg-emerald-100 text-emerald-700', accent: 'bg-emerald-600' },
  3: { label: 'Particular Pagado', badge: 'bg-violet-100 text-violet-700', accent: 'bg-violet-600' },
  4: { label: 'Corp. Adm. Delegada', badge: 'bg-orange-100 text-orange-700', accent: 'bg-orange-600' },
  5: { label: 'Serv. Local Educación', badge: 'bg-rose-100 text-rose-700', accent: 'bg-rose-600' },
}

function formatArancel(val: string | undefined): string {
  if (!val) return 'Sin información'
  const v = val.trim().toUpperCase()
  if (v === 'GRATUITO' || v === '1' || v === '0') return 'Gratuito'
  return val
}

export interface ColegioCardData {
  rbd: number
  nombre: string
  dependencia2: string
  dependencia2Codigo: number
  region: string
  comuna: string
  mat_total: number
  pagoMensual: string
  nivelesEnsenianza: string[]
}

export default function ColegioCard({ colegio }: { colegio: ColegioCardData }) {
  const config = DEPENDENCIA2_CONFIG[colegio.dependencia2Codigo] ?? {
    label: colegio.dependencia2,
    badge: 'bg-gray-100 text-gray-600',
    accent: 'bg-gray-500',
  }

  const mensualidad = formatArancel(colegio.pagoMensual)
  const esGratuito = mensualidad === 'Gratuito'

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className={`h-1.5 w-full ${config.accent}`} />

      <div className="flex flex-col flex-1 p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${config.badge}`}>
            {config.label}
          </span>
          {colegio.nivelesEnsenianza.slice(0, 1).map((n) => (
            <span key={n} className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
              {n}
            </span>
          ))}
        </div>

        {/* Nombre */}
        <h2 className="text-base font-semibold text-gray-900 leading-snug mb-3">
          {colegio.nombre}
        </h2>

        {/* Detalles */}
        <dl className="space-y-2 flex-1">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-gray-400 shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </span>
            <dd className="text-sm text-gray-600">
              {colegio.comuna}, {colegio.region}
            </dd>
          </div>
          {colegio.mat_total > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-gray-400 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 14.094A5.973 5.973 0 004 17v1H1v-1a3 3 0 013.75-2.906z" />
                </svg>
              </span>
              <dd className="text-sm text-gray-600">
                {colegio.mat_total.toLocaleString('es-CL')} alumnos
              </dd>
            </div>
          )}
        </dl>

        {/* Mensualidad + CTA */}
        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-400 mb-0.5">Mensualidad</p>
            <p className={`text-sm font-semibold truncate ${esGratuito ? 'text-emerald-600' : 'text-gray-900'}`}>
              {mensualidad}
            </p>
          </div>
          <Link
            href={`/colegios/${colegio.rbd}`}
            className="shrink-0 bg-blue-800 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-150"
          >
            Ver más
          </Link>
        </div>
      </div>
    </article>
  )
}
