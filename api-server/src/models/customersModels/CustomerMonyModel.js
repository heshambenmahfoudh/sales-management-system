import mongoose from 'mongoose'

const customerMonySchema = new mongoose.Schema(
  {
    customerMonyId: {
      type: String,
    },
    order: {
      type: String,
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'Customer',
    },
    date: {
      type: Date,
    },
    dateMaturity: {
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
    }
  },
  { timestamps: true },
)

export default mongoose.model('Customermony', customerMonySchema)
