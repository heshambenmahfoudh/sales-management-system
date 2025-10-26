import mongoose from 'mongoose'

const PaySalarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
    },
    safe: {
      type: String,
      ref: 'Safe',
    },
    responsibleName: {
      type: String,
    },
    salary: {
      type: Number,
    },
    netWithdrawals: {
      type: Number,
    },
    netSalary: {
      type: Number,
    },

    givingDate: {
      type: Date,
    },
    dueDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  { timestamps: true },
)

export default mongoose.model('PaySalary', PaySalarySchema)
