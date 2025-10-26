import mongoose from 'mongoose'

const depositeSchema = new mongoose.Schema(
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
    typeDeposite: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Deposite', depositeSchema)
