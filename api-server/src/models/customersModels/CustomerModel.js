import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Customer', customerSchema)
