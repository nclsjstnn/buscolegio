import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEstablecimiento extends Document {
  rbd: number
  nombre: string
  agno: number
  dependenciaCodigo: number
  dependencia: string
  dependencia2Codigo: number
  dependencia2: string
  regionCodigo: number
  region: string
  provinciaCodigo: number
  comunaCodigo: number
  comuna: string
  deprovCodigo: number
  deprov: string
  rural: boolean
  latitud: number
  longitud: number
  convenio_pie: boolean
  pace: boolean
  nivelesEnsenianza: string[]
  mat_parvulario: number
  mat_basicaRegular: number
  mat_basicaAdulto: number
  mat_especial: number
  mat_mediaHCJovenes: number
  mat_mediaHCAdultos: number
  mat_mediaTPJovenes: number
  mat_mediaTPAdultos: number
  mat_total: number
  tieneMatricula: boolean
  estado: string
  estadoCodigo: number
  orientacionReligiosaCodigo: number
  orientacionReligiosa: string
  orientacionReligiosaGlosa: string
  pagoMatricula: string
  pagoMensual: string
  especialidades: string[]
  // Google Places enrichment (populated on first detail-page visit)
  googlePlacesEnriched: boolean
  googlePlacesFetchedAt: Date
  googlePlacesId: string | null
  googleTelefono: string | null
  googleWebsite: string | null
  googleRating: number | null
  googleRatingsTotal: number | null
  googleDireccion: string | null
  googleHorarios: string[]
}

const EstablecimientoSchema = new Schema<IEstablecimiento>({
  rbd: { type: Number, required: true, unique: true },
  nombre: String,
  agno: Number,
  dependenciaCodigo: Number,
  dependencia: String,
  dependencia2Codigo: Number,
  dependencia2: String,
  regionCodigo: Number,
  region: String,
  provinciaCodigo: Number,
  comunaCodigo: Number,
  comuna: String,
  deprovCodigo: Number,
  deprov: String,
  rural: Boolean,
  latitud: Number,
  longitud: Number,
  convenio_pie: Boolean,
  pace: Boolean,
  nivelesEnsenianza: [String],
  mat_parvulario: Number,
  mat_basicaRegular: Number,
  mat_basicaAdulto: Number,
  mat_especial: Number,
  mat_mediaHCJovenes: Number,
  mat_mediaHCAdultos: Number,
  mat_mediaTPJovenes: Number,
  mat_mediaTPAdultos: Number,
  mat_total: Number,
  tieneMatricula: Boolean,
  estado: String,
  estadoCodigo: Number,
  orientacionReligiosaCodigo: Number,
  orientacionReligiosa: String,
  orientacionReligiosaGlosa: String,
  pagoMatricula: String,
  pagoMensual: String,
  especialidades: [String],
  googlePlacesEnriched: { type: Boolean, default: false },
  googlePlacesFetchedAt: Date,
  googlePlacesId: String,
  googleTelefono: String,
  googleWebsite: String,
  googleRating: Number,
  googleRatingsTotal: Number,
  googleDireccion: String,
  googleHorarios: [String],
})

EstablecimientoSchema.index({ nombre: 'text', comuna: 'text' })
EstablecimientoSchema.index({ regionCodigo: 1 })
EstablecimientoSchema.index({ dependencia2Codigo: 1 })
EstablecimientoSchema.index({ estadoCodigo: 1 })
EstablecimientoSchema.index({ googlePlacesEnriched: 1 })

const Establecimiento: Model<IEstablecimiento> =
  mongoose.models.Establecimiento ??
  mongoose.model<IEstablecimiento>('Establecimiento', EstablecimientoSchema)

export default Establecimiento
