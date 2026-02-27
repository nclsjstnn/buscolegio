'use client'

import { useState, useEffect, useRef } from 'react'

interface Review {
  id: string
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
  const storageKey = `buscolegio-reviews-${rbd}`
  const [reviews, setReviews] = useState<Review[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [draftRating, setDraftRating] = useState(0)
  const [draftTexto, setDraftTexto] = useState('')
  const newReviewRef = useRef<HTMLLIElement | null>(null)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) setReviews(JSON.parse(raw) as Review[])
    } catch {
      // ignore parse errors
    }
  }, [storageKey])

  // Show form directly when there are no reviews
  useEffect(() => {
    if (mounted && reviews.length === 0) setShowForm(true)
  }, [mounted, reviews.length])

  function saveReview(review: Review) {
    const updated = [review, ...reviews]
    setReviews(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch {
      // ignore storage errors
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (draftRating < 1 || draftTexto.trim().length < 10) return
    const review: Review = {
      id: Date.now().toString(),
      rating: draftRating,
      texto: draftTexto.trim(),
      fecha: new Date().toISOString(),
    }
    saveReview(review)
    setDraftRating(0)
    setDraftTexto('')
    setShowForm(false)
    setFilter(null)
    // Scroll to the new review after render
    setTimeout(() => {
      newReviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }, 50)
  }

  if (!mounted) return null

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null

  const filtered = filter
    ? [...reviews].filter((r) => r.rating === filter)
    : [...reviews]
  // newest-first (already newest-first since we prepend on save, but sort to be safe)
  filtered.sort((a, b) => b.id.localeCompare(a.id))

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

      {/* Review list */}
      {filtered.length > 0 && (
        <ul className="space-y-3 mb-5">
          {filtered.map((review, idx) => (
            <li
              key={review.id}
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
              disabled={!isValid}
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Publicar opinión
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
