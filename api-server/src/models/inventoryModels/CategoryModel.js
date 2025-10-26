import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: 'Brand',
    },
  },
  { timestamps: true },
)

export default mongoose.model('Category', categorySchema)
