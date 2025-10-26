import mongoose from 'mongoose'

const TransferMonySchema = new mongoose.Schema(
  {
    from_safe: {
      type: String,
      ref: 'Safe',
    },
    to_safe: {
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
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('TransferMony', TransferMonySchema)
