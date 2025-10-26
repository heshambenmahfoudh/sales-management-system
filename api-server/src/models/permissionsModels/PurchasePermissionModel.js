import mongoose from 'mongoose'

const purchasePermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    purchasesDataDisplay: { type: Boolean, default: false },
    purchasesDataCreate: { type: Boolean, default: false },
    purchasesDataUpdate: { type: Boolean, default: false },
    purchasesDataDelete: { type: Boolean, default: false },
    purchasesDataViewInvoice: { type: Boolean, default: false },

    purchasesReturnDisplay: { type: Boolean, default: false },
    purchasesReturnCreate: { type: Boolean, default: false },
    purchasesReturnUpdate: { type: Boolean, default: false },
    purchasesReturnDelete: { type: Boolean, default: false },
    purchasesReturnViewInvoice: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('PurchasePermission', purchasePermissionSchema)
