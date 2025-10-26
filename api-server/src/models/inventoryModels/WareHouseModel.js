import mongoose from 'mongoose'

const warehouseSchema = new mongoose.Schema(
  {
    warehouseType: {
      type: String,
    },
    title: {
      type: String,
    },
    location: {
      type: String,
    },
    description: {
      type: String,
    },
    totalProduct: {
      type: Number,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Warehouse', warehouseSchema)
