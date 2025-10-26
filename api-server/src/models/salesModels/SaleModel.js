import mongoose from 'mongoose'

const saleSchema = new mongoose.Schema(
  {
    order: {
      type: String,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer',
    },
    cashCustomer: {
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
    price: {
      type: Number,
    },
    totalPrice: { type: Number },
    date: {
      type: Date,
    },
    totalItemsPrice: {
      type: Number,
    },
    pay: {
      type: Number,
    },
    balance: {
      type: Number,
    },
    resposibleName: {
      type: String,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Sale', saleSchema)
