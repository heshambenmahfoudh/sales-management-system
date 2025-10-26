import mongoose from 'mongoose'

const brandSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Brand', brandSchema)
