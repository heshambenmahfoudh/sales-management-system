import mongoose from 'mongoose'

const supplierSchema = new mongoose.Schema(
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

export default mongoose.models.Supplier ||
  mongoose.model('Supplier', supplierSchema)
