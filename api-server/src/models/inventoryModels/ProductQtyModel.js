import mongoose from 'mongoose'

const productqtySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    sku: {
      type: String,
    },
    warehouse: {
      type: mongoose.Types.ObjectId,
      ref: 'Warehouse',
    },
    date: {
      type: Date,
    },
    qty: {
      type: Number,
    },
    buyPrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('ProductQty', productqtySchema)
