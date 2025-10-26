import mongoose from 'mongoose'

const customerPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    customersDataDisplay: { type: Boolean, default: false },
    customersDataCreate: { type: Boolean, default: false },
    customersDataUpdate: { type: Boolean, default: false },
    customersDataDelete: { type: Boolean, default: false },

    customersPaidDisplay: { type: Boolean, default: false },
    customersPaidUpdate: { type: Boolean, default: false },
    customersPaidDelete: { type: Boolean, default: false },

    customersDelayedDisplay: { type: Boolean, default: false },
    customersDelayedUpdate: { type: Boolean, default: false },
    customersDelayedDelete: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('customerPermission', customerPermissionSchema)
