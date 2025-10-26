import mongoose from 'mongoose'

const spendablePermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    typeSpendablesDataDisplay: { type: Boolean, default: false },
    typeSpendablesDataCreate: { type: Boolean, default: false },
    typeSpendablesDataUpdate: { type: Boolean, default: false },
    typeSpendablesDataDelete: { type: Boolean, default: false },

    spendablesDataDisplay: { type: Boolean, default: false },
    spendablesDataCreate: { type: Boolean, default: false },
    spendablesDataView: { type: Boolean, default: false },
    spendablesDataDelete: { type: Boolean, default: false },

    bondsSpendablesDataDisplay: { type: Boolean, default: false },
    bondsSpendablesDataCreate: { type: Boolean, default: false },
    bondsSpendablesDataView: { type: Boolean, default: false },
    bondsSpendablesDataDelete: { type: Boolean, default: false },
    bondsSpendablesDataViewInvoice: { type: Boolean, default: false },

    bondsReceivablesDataDisplay: { type: Boolean, default: false },
    bondsReceivablesDataCreate: { type: Boolean, default: false },
    bondsReceivablesDataView: { type: Boolean, default: false },
    bondsReceivablesDataDelete: { type: Boolean, default: false },
    bondsReceivablesDataViewInvoice: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('SpendablePermission', spendablePermissionSchema)
