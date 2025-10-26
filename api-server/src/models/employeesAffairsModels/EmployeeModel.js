import mongoose from 'mongoose'

const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    idNumber: {
      type: String,
    },
    salary: {
      type: Number,
    },
    date: {
      type: Date,
    },
    notes: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('Employee', EmployeeSchema)
