import mongoose from 'mongoose'

const returnPurchaseSchema = new mongoose.Schema(
  {
    returnId: {
      type: String,
    },
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
    totalPrice: {
      type: Number,
    },
    warehouse: {
      type: mongoose.Types.ObjectId,
      ref: 'Warehouse',
    },
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
      default: 0,
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

export default mongoose.model('ReturnPurchase', returnPurchaseSchema)
