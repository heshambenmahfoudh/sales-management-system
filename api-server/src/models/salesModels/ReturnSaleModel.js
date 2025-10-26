import mongoose from 'mongoose'

const returnSaleSchema = new mongoose.Schema(
  {
    returnId: {
      type: String,
    },
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
    },
    resposibleName: {
      type: String
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('ReturnSale', returnSaleSchema)
