import mongoose from 'mongoose'

const supplierPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    suppliersDataDisplay: { type: Boolean, default: false },
    suppliersDataCreate: { type: Boolean, default: false },
    suppliersDataUpdate: { type: Boolean, default: false },
    suppliersDataDelete: { type: Boolean, default: false },

    suppliersPaidDisplay: { type: Boolean, default: false },
    suppliersPaidUpdate: { type: Boolean, default: false },
    suppliersPaidDelete: { type: Boolean, default: false },

    suppliersDelayedDisplay: { type: Boolean, default: false },
    suppliersDelayedUpdate: { type: Boolean, default: false },
    suppliersDelayedDelete: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('SupplierPermission', supplierPermissionSchema)
