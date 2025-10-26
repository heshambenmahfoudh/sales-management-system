import mongoose from 'mongoose'

const MonyPulledSchema = new mongoose.Schema(
  {
    safe: {
      type: String,
      ref: 'Safe',
    },
    mony: {
      type: Number,
    },
    date: {
      type: Date,
    },
    name: {
      type: String,
    },
    typePulled: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('MonyPulled', MonyPulledSchema)
