import mongoose from 'mongoose'

const spendableSchema = new mongoose.Schema(
  {
    typespendable: {
      type: mongoose.Types.ObjectId,
      ref: 'TypeSpendable',
    },
    name: {
      type: String,
    },
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
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Spendable', spendableSchema)
