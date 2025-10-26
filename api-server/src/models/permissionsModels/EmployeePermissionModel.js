import mongoose from 'mongoose'

const employeePermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    employeesDataDisplay: { type: Boolean, default: false },
    employeesDataCreate: { type: Boolean, default: false },
    employeesDataUpdate: { type: Boolean, default: false },
    employeesDataDelete: { type: Boolean, default: false },

    employeesWithdrawalsDataDisplay: { type: Boolean, default: false },
    employeesWithdrawalsDataCreate: { type: Boolean, default: false },
    employeesWithdrawalsDataView: { type: Boolean, default: false },
    employeesWithdrawalsDataDelete: { type: Boolean, default: false },

    employeesPaySalaryDataDisplay: { type: Boolean, default: false },
    employeesPaySalaryDataCreate: { type: Boolean, default: false },
    employeesPaySalaryDataView: { type: Boolean, default: false },
    employeesPaySalaryDataDelete: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('EmployeePermission', employeePermissionSchema)
