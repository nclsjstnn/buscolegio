import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IReview extends Document {
  rbd: number
  rating: number
  texto: string
  fecha: Date
}

const ReviewSchema = new Schema<IReview>({
  rbd:    { type: Number, required: true, index: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  texto:  { type: String, required: true, minlength: 10 },
  fecha:  { type: Date, default: Date.now },
})

const Review: Model<IReview> =
  mongoose.models.Review ??
  mongoose.model<IReview>('Review', ReviewSchema)

export default Review
