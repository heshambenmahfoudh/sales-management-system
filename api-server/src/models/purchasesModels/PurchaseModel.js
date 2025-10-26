import mongoose from 'mongoose'

const purchaseSchema = new mongoose.Schema(
  {
    order: {
      type: String,
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: 'Supplier',
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
    isStored: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
    },
    resposibleName: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Purchase', purchaseSchema)
