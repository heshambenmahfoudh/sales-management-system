import mongoose from 'mongoose'

const WithdrawalsSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
    },
    safe: {
      type: String,
      ref: 'Safe',
    },
    responsible: {
      type: String,
    },
    mony: {
      type: Number,
    },
    date: {
      type: Date,
    },
    pay: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Withdrawals', WithdrawalsSchema)
