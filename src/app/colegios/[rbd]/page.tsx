import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { connectDB } from '@/lib/mongodb'
import Establecimiento from '@/models/Establecimiento'
import type { IEstablecimiento } from '@/models/Establecimiento'
import MapWrapper from '@/components/MapWrapper'
import ReviewsSection from '@/components/ReviewsSection'
import SiteFooter from '@/components/SiteFooter'
import { fetchGooglePlacesData } from '@/lib/googlePlaces'

const DEPENDENCIA2_COLORS: Record<number, { badge: string; bar: string }> = {
  1: { badge: 'bg-blue-100 text-blue-700', bar: 'bg-blue-700' },
  2: { badge: 'bg-emerald-100 text-emerald-700', bar: 'bg-emerald-600' },
  3: { badge: 'bg-violet-100 text-violet-700', bar: 'bg-violet-600' },
  4: { badge: 'bg-orange-100 text-orange-700', bar: 'bg-orange-600' },
  5: { badge: 'bg-rose-100 text-rose-700', bar: 'bg-rose-600' },
}

const MAT_ROWS = [
  { key: 'mat_parvulario', label: 'Parvularia' },
  { key: 'mat_basicaRegular', label: 'Básica Regular' },
  { key: 'mat_basicaAdulto', label: 'Básica Adultos' },
  { key: 'mat_especial', label: 'Especial / Diferencial' },
  { key: 'mat_mediaHCJovenes', label: 'Media HC Jóvenes' },
  { key: 'mat_mediaHCAdultos', label: 'Media HC Adultos' },
  { key: 'mat_mediaTPJovenes', label: 'Media TP Jóvenes' },
  { key: 'mat_mediaTPAdultos', label: 'Media TP Adultos' },
] as const

function formatArancel(val: string | undefined): string {
  if (!val) return 'Sin información'
  const v = val.trim().toUpperCase()
  if (v === 'GRATUITO' || v === '1' || v === '0') return 'Gratuito'
  // Format number ranges like "50000" or "50000-100000"
  return val
}

async function getColegio(rbd: number): Promise<IEstablecimiento | null> {
  await connectDB()
  let colegio = await Establecimiento.findOne({ rbd }).lean() as IEstablecimiento | null
  if (!colegio) return null

  if (!colegio.googlePlacesEnriched && process.env.GOOGLE_PLACES_API_KEY) {
    const places = await fetchGooglePlacesData(
      colegio.nombre,
      colegio.comuna,
      colegio.latitud,
      colegio.longitud,
    )
    const update = {
      googlePlacesEnriched: true,
      googlePlacesFetchedAt: new Date(),
      googlePlacesId: places.placeId,
      googleTelefono: places.telefono,
      googleWebsite: places.website,
      googleRating: places.rating,
      googleRatingsTotal: places.ratingsTotal,
      googleDireccion: places.direccion,
      googleHorarios: places.horarios,
    }
    await Establecimiento.updateOne({ rbd }, { $set: update })
    Object.assign(colegio, update)
  }

  return colegio
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ rbd: string }>
}): Promise<Metadata> {
  const { rbd } = await params
  const rbdNum = parseInt(rbd, 10)
  if (isNaN(rbdNum)) return {}
  const colegio = await getColegio(rbdNum)
  if (!colegio) return {}

  const title = `${colegio.nombre} — Buscolegio`
  const description = `${colegio.dependencia2} en ${colegio.comuna}, ${colegio.region}. RBD ${colegio.rbd}. Matrícula total: ${colegio.mat_total > 0 ? colegio.mat_total.toLocaleString('es-CL') : 'sin datos'} alumnos.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/colegios/${colegio.rbd}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  }
}

export default async function ColegioDetailPage({
  params,
}: {
  params: Promise<{ rbd: string }>
}) {
  const { rbd } = await params
  const rbdNum = parseInt(rbd, 10)
  if (isNaN(rbdNum)) notFound()

  const colegio = await getColegio(rbdNum)
  if (!colegio) notFound()

  const colors = DEPENDENCIA2_COLORS[colegio.dependencia2Codigo] ?? {
    badge: 'bg-gray-100 text-gray-700',
    bar: 'bg-gray-500',
  }

  const hasMap = colegio.latitud !== 0 && colegio.longitud !== 0

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

      {/* Color bar */}
      <div className={`h-1.5 w-full ${colors.bar}`} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-blue-700 hover:text-blue-800 mb-6 font-medium transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Volver a resultados
        </Link>

        {/* Header section */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge}`}>
              {colegio.dependencia2}
            </span>
            {colegio.estado !== 'Funcionando' && (
              <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-red-100 text-red-700">
                {colegio.estado}
              </span>
            )}
            {colegio.rural && (
              <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
                Rural
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-1">
            {colegio.nombre}
          </h1>
          <p className="text-sm text-gray-500">RBD {colegio.rbd}</p>
        </section>

        {/* Location grid */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Ubicación</h2>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <dt className="text-xs text-gray-400 mb-0.5">Región</dt>
              <dd className="text-sm font-medium text-gray-900">{colegio.region}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 mb-0.5">Provincia / Deprov</dt>
              <dd className="text-sm font-medium text-gray-900">{colegio.deprov}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 mb-0.5">Comuna</dt>
              <dd className="text-sm font-medium text-gray-900">{colegio.comuna}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-400 mb-0.5">Zona</dt>
              <dd className="text-sm font-medium text-gray-900">{colegio.rural ? 'Rural' : 'Urbana'}</dd>
            </div>
          </dl>
        </section>

        {/* Map */}
        {hasMap && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6 overflow-hidden">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Mapa</h2>
            <MapWrapper lat={colegio.latitud} lng={colegio.longitud} nombre={colegio.nombre} />
          </section>
        )}

        {/* Contact — Google Places enriched data */}
        {(colegio.googleTelefono || colegio.googleWebsite || colegio.googleRating || colegio.googleDireccion || (colegio.googleHorarios?.length ?? 0) > 0) && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Contacto e información</h2>
            <dl className="space-y-3 mb-4">
              {colegio.googleWebsite && (
                <div className="flex items-start gap-2">
                  <dt className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Sitio web</dt>
                  <dd className="text-sm">
                    <a
                      href={colegio.googleWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-700 hover:text-blue-800 hover:underline break-all"
                    >
                      {colegio.googleWebsite.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                    </a>
                  </dd>
                </div>
              )}
              {colegio.googleTelefono && (
                <div className="flex items-start gap-2">
                  <dt className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Teléfono</dt>
                  <dd className="text-sm font-medium text-gray-900">{colegio.googleTelefono}</dd>
                </div>
              )}
              {colegio.googleDireccion && (
                <div className="flex items-start gap-2">
                  <dt className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">Dirección</dt>
                  <dd className="text-sm font-medium text-gray-900">{colegio.googleDireccion}</dd>
                </div>
              )}
            </dl>

            {colegio.googleRating && (
              <p className="text-sm text-gray-800 mb-4">
                <span className="font-semibold text-amber-500">{colegio.googleRating.toFixed(1)} ★</span>
                {colegio.googleRatingsTotal && (
                  <span className="text-gray-500 ml-1">({colegio.googleRatingsTotal.toLocaleString('es-CL')} reseñas en Google)</span>
                )}
              </p>
            )}

            {(colegio.googleHorarios?.length ?? 0) > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Horarios</h3>
                <ul className="space-y-1">
                  {colegio.googleHorarios.map((h) => (
                    <li key={h} className="text-sm text-gray-700">{h}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Reviews */}
        <ReviewsSection rbd={colegio.rbd} />

        {/* Programs */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Programas y características</h2>
          <div className="flex flex-wrap gap-2">
            {colegio.convenio_pie && (
              <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700">
                PIE
              </span>
            )}
            {colegio.pace && (
              <span className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-teal-100 text-teal-700">
                PACE
              </span>
            )}
            {!colegio.convenio_pie && !colegio.pace && (
              <p className="text-sm text-gray-400">Sin programas especiales</p>
            )}
          </div>
        </section>

        {/* Niveles de enseñanza */}
        {colegio.nivelesEnsenianza.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Niveles de enseñanza</h2>
            <div className="flex flex-wrap gap-2">
              {colegio.nivelesEnsenianza.map((n) => (
                <span key={n} className="inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  {n}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Matrícula por nivel */}
        <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Matrícula por nivel</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left font-medium text-gray-500 pb-2 pr-4">Nivel</th>
                  <th className="text-right font-medium text-gray-500 pb-2">Alumnos</th>
                </tr>
              </thead>
              <tbody>
                {MAT_ROWS.map(({ key, label }) => {
                  const val = colegio[key as keyof IEstablecimiento] as number
                  return (
                    <tr key={key} className="border-b border-gray-50">
                      <td className="py-2 pr-4 text-gray-700">{label}</td>
                      <td className="py-2 text-right font-medium text-gray-900">
                        {val > 0 ? val.toLocaleString('es-CL') : '—'}
                      </td>
                    </tr>
                  )
                })}
                <tr className="font-semibold text-gray-900 border-t border-gray-200">
                  <td className="pt-3 pr-4">Total</td>
                  <td className="pt-3 text-right">
                    {colegio.mat_total > 0 ? colegio.mat_total.toLocaleString('es-CL') : '—'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Especialidades */}
        {colegio.especialidades.length > 0 && (
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Especialidades técnico-profesionales</h2>
            <div className="flex flex-wrap gap-2">
              {colegio.especialidades.map((e) => (
                <span key={e} className="inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-100">
                  {e}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Aranceles y orientación */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Aranceles</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Matrícula</dt>
                <dd className={`text-sm font-semibold ${formatArancel(colegio.pagoMatricula) === 'Gratuito' ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {formatArancel(colegio.pagoMatricula)}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400 mb-0.5">Mensualidad</dt>
                <dd className={`text-sm font-semibold ${formatArancel(colegio.pagoMensual) === 'Gratuito' ? 'text-emerald-600' : 'text-gray-900'}`}>
                  {formatArancel(colegio.pagoMensual)}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-gray-800 mb-4">Orientación religiosa</h2>
            <p className="text-sm font-semibold text-gray-900">{colegio.orientacionReligiosa}</p>
            {colegio.orientacionReligiosaGlosa && (
              <p className="text-xs text-gray-500 mt-1">{colegio.orientacionReligiosaGlosa}</p>
            )}
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
