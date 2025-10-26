import mongoose from 'mongoose'

const BondSpendableSchema = new mongoose.Schema(
  {
    safe: {
      type: String,
      ref: 'Safe',
    },
    spendableTo: {
      type: String,
    },
    spendableResponsible: {
      type: String,
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

export default mongoose.model('BondSpendable', BondSpendableSchema)
