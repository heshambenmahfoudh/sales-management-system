import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    brand: {
      type: mongoose.Types.ObjectId,
      ref: 'Brand',
    },
    unit: {
      type: mongoose.Types.ObjectId,
      ref: 'Unit',
    },
    buyPrice: {
      type: Number,
    },
    salePrice: {
      type: Number,
    },
    sku: {
      type: String,
    },
    proQty: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)
export default mongoose.model('Product', productSchema)
