import mongoose from 'mongoose'

const BondReceivableSchema = new mongoose.Schema(
  {
    safe: {
      type: String,
      ref: 'Safe',
    },
    rceivableFrom: {
      type: String,
    },
    receivableResponsible: {
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

export default mongoose.model('BondReceivable', BondReceivableSchema)
