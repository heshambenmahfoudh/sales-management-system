import mongoose from 'mongoose'

const salePermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    salesDataDisplay: { type: Boolean, default: false },
    salesDataCreate: { type: Boolean, default: false },
    salesDataUpdate: { type: Boolean, default: false },
    salesDataDelete: { type: Boolean, default: false },
    salesDataViewInvoice: { type: Boolean, default: false },

    salesReturnDisplay: { type: Boolean, default: false },
    salesReturnCreate: { type: Boolean, default: false },
    salesReturnUpdate: { type: Boolean, default: false },
    salesReturnDelete: { type: Boolean, default: false },
    salesReturnViewInvoice: { type: Boolean, default: false },

    salesEarningDisplay: { type: Boolean, default: false },
    salesEarningDelete: { type: Boolean, default: false },
    salesEarningInvoice: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('SalePermission', salePermissionSchema)
