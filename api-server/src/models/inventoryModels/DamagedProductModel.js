import mongoose from 'mongoose'

const DamagedProductSchema = new mongoose.Schema(
  {
    fromWarehouse: {
      type: mongoose.Types.ObjectId,
      ref: 'Warehouse',
    },
    responsibleName: {
      type: String,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    sku: {
      type: String,
    },
    unit: {
      type: mongoose.Types.ObjectId,
      ref: 'Unit',
    },
    qty: {
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

export default mongoose.model('DamagedProduct', DamagedProductSchema)
