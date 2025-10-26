import mongoose from 'mongoose'

const unitSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Unit', unitSchema)
