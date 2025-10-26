import mongoose from 'mongoose'

const supplierMonySchema = new mongoose.Schema(
  {
    supplierMonyId: {
      type: String,
    },
    order: {
      type: String,
    },
    supplier: {
      type: mongoose.Types.ObjectId,
      ref: 'Supplier',
    },
    date: {
      type: Date,
    },
    dateMaturity: {
      type: Date,
    },
    datePay: {
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
  },
  { timestamps: true },
)

export default mongoose.model('SupplierMony', supplierMonySchema)
