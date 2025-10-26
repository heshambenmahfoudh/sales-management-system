import mongoose from 'mongoose'

const moniesSchema = new mongoose.Schema(
  {
    safe: {
      type: String,
      ref: 'Safe',
    },
    mony: {
      type: Number,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Monies', moniesSchema)
