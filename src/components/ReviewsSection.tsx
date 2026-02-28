'use client'

import { useState, useEffect, useRef } from 'react'

interface Review {
  _id: string
  rating: number
  texto: string
  fecha: string
}

interface Props {
  rbd: number
}

function Stars({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <span className="text-amber-400 tracking-tight" aria-label={`${rating} de ${max} estrellas`}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i}>{i < rating ? '★' : '☆'}</span>
      ))}
    </span>
  )
}

function InteractiveStars({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hovered, setHovered] = useState(0)
  const displayed = hovered || value
  return (
    <span className="inline-flex gap-1 text-2xl cursor-pointer">
      {Array.from({ length: 5 }, (_, i) => {
        const star = i + 1
        return (
          <button
            key={star}
            type="button"
            className={`transition-colors ${star <= displayed ? 'text-amber-400' : 'text-gray-300'}`}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(star)}
            aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
          >
            ★
          </button>
        )
      })}
    </span>
  )
}

export default function ReviewsSection({ rbd }: Props) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [draftRating, setDraftRating] = useState(0)
  const [draftTexto, setDraftTexto] = useState('')
  const newReviewRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    fetch(`/api/colegios/${rbd}/reviews`)
      .then((res) => res.json())
      .then((data: { reviews: Review[] }) => {
        setReviews(data.reviews)
      })
      .catch(() => setError('No se pudieron cargar las opiniones'))
      .finally(() => setLoading(false))
  }, [rbd])

  // Show form directly when there are no reviews
  useEffect(() => {
    if (!loading && reviews.length === 0) setShowForm(true)
  }, [loading, reviews.length])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (draftRating < 1 || draftTexto.trim().length < 10) return

    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/colegios/${rbd}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: draftRating, texto: draftTexto.trim() }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Error al publicar la opinión')
        return
      }
      const data = await res.json()
      setReviews((prev) => [data.review as Review, ...prev])
      setDraftRating(0)
      setDraftTexto('')
      setShowForm(false)
      setFilter(null)
      setTimeout(() => {
        newReviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 50)
    } catch {
      setError('Error de red. Intenta nuevamente.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-4">Opiniones de apoderados</h2>
        <p className="text-sm text-gray-400">Cargando opiniones...</p>
      </section>
    )
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  const filtered = filter
    ? reviews.filter((r) => r.rating === filter)
    : reviews

  const isValid = draftRating >= 1 && draftTexto.trim().length >= 10

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
      <h2 className="text-base font-semibold text-gray-800 mb-4">Opiniones de apoderados</h2>

      {/* Summary */}
      {reviews.length > 0 && avgRating !== null && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Stars rating={Math.round(avgRating)} />
            <span className="text-sm font-semibold text-gray-800">
              {avgRating.toFixed(1)} promedio
            </span>
            <span className="text-sm text-gray-400">
              ({reviews.length} {reviews.length === 1 ? 'opinión' : 'opiniones'})
            </span>
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilter(null)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                filter === null
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              Todas
            </button>
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => r.rating === star).length
              if (count === 0) return null
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFilter(filter === star ? null : star)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    filter === star
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  {star}★ ({count})
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {reviews.length === 0 && (
        <p className="text-sm text-gray-400 mb-4">Sé el primero en dejar una opinión</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mb-4">{error}</p>
      )}

      {/* Review list */}
      {filtered.length > 0 && (
        <ul className="space-y-3 mb-5">
          {filtered.map((review, idx) => (
            <li
              key={review._id}
              ref={idx === 0 && !showForm ? newReviewRef : undefined}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Stars rating={review.rating} />
                <span className="text-xs text-gray-400">
                  {new Date(review.fecha).toLocaleDateString('es-CL', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.texto}</p>
              <p className="text-xs text-gray-400 mt-1.5">Apoderado anónimo</p>
            </li>
          ))}
        </ul>
      )}

      {filtered.length === 0 && filter !== null && (
        <p className="text-sm text-gray-400 mb-4">No hay opiniones con {filter} estrella{filter > 1 ? 's' : ''}.</p>
      )}

      {/* Toggle button */}
      {!showForm && (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
        >
          + Dejar mi opinión
        </button>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mt-2 rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Calificación</label>
            <InteractiveStars value={draftRating} onChange={setDraftRating} />
            {draftRating === 0 && (
              <p className="text-xs text-gray-400 mt-1">Selecciona una calificación</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5" htmlFor="review-texto">
              Tu opinión
            </label>
            <textarea
              id="review-texto"
              value={draftTexto}
              onChange={(e) => setDraftTexto(e.target.value)}
              placeholder="Cuéntanos tu experiencia... (mínimo 10 caracteres)"
              rows={4}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-400"
            />
            {draftTexto.trim().length > 0 && draftTexto.trim().length < 10 && (
              <p className="text-xs text-red-500 mt-1">
                {10 - draftTexto.trim().length} caracteres más para continuar
              </p>
            )}
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!isValid || submitting}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Publicando...' : 'Publicar opinión'}
            </button>
            {reviews.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setDraftRating(0)
                  setDraftTexto('')
                }}
                className="text-sm font-medium px-4 py-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}
    </section>
  )
}
