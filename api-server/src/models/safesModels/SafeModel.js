import mongoose from 'mongoose'

const safeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Safe', safeSchema)
