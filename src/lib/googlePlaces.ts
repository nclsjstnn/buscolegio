export interface GooglePlacesData {
  placeId: string | null
  telefono: string | null
  website: string | null
  rating: number | null
  ratingsTotal: number | null
  direccion: string | null
  horarios: string[]
}

const EMPTY: GooglePlacesData = {
  placeId: null,
  telefono: null,
  website: null,
  rating: null,
  ratingsTotal: null,
  direccion: null,
  horarios: [],
}

export async function fetchGooglePlacesData(
  nombre: string,
  comuna: string,
  lat: number,
  lng: number,
): Promise<GooglePlacesData> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return { ...EMPTY }

  try {
    // 1. Text Search to get place_id
    const query = encodeURIComponent(`${nombre} ${comuna} Chile`)
    const locationbias = `circle:5000@${lat},${lng}`
    const searchUrl =
      `https://maps.googleapis.com/maps/api/place/textsearch/json` +
      `?query=${query}&locationbias=${encodeURIComponent(locationbias)}&language=es&key=${apiKey}`

    const searchRes = await fetch(searchUrl, { cache: 'no-store' })
    if (!searchRes.ok) {
      console.error('[googlePlaces] Text Search HTTP error', searchRes.status)
      return { ...EMPTY }
    }

    const searchJson = await searchRes.json()
    if (!searchJson.results?.length) return { ...EMPTY }

    const placeId: string = searchJson.results[0].place_id

    // 2. Place Details
    const fields = 'name,formatted_phone_number,website,rating,user_ratings_total,formatted_address,opening_hours'
    const detailsUrl =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${placeId}&fields=${fields}&language=es&key=${apiKey}`

    const detailsRes = await fetch(detailsUrl, { cache: 'no-store' })
    if (!detailsRes.ok) {
      console.error('[googlePlaces] Place Details HTTP error', detailsRes.status)
      return { ...EMPTY, placeId }
    }

    const detailsJson = await detailsRes.json()
    const r = detailsJson.result ?? {}

    return {
      placeId,
      telefono: r.formatted_phone_number ?? null,
      website: r.website ?? null,
      rating: r.rating ?? null,
      ratingsTotal: r.user_ratings_total ?? null,
      direccion: r.formatted_address ?? null,
      horarios: r.opening_hours?.weekday_text ?? [],
    }
  } catch (err) {
    console.error('[googlePlaces] Unexpected error', err)
    return { ...EMPTY }
  }
}
