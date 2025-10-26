import mongoose from 'mongoose'

const typeSpendableSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('TypeSpendable', typeSpendableSchema)
