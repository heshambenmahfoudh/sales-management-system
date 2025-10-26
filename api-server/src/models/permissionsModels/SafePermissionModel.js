import mongoose from 'mongoose'

const safePermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },

    safesDataDisplay: { type: Boolean, default: false },
    safesDataCreate: { type: Boolean, default: false },
    safesDataUpdate: { type: Boolean, default: false },
    safesDataDelete: { type: Boolean, default: false },

    safesDepositsDisplay: { type: Boolean, default: false },
    safesDepositsCreate: { type: Boolean, default: false },
    safesDepositsView: { type: Boolean, default: false },
    safesDepositsDelete: { type: Boolean, default: false },

    safesPulledDisplay: { type: Boolean, default: false },
    safesPulledCreate: { type: Boolean, default: false },
    safesPulledView: { type: Boolean, default: false },
    safesPulledDelete: { type: Boolean, default: false },

    safesTransfersDisplay: { type: Boolean, default: false },
    safesTransfersCreate: { type: Boolean, default: false },
    safesTransfersView: { type: Boolean, default: false },
    safesTransfersDelete: { type: Boolean, default: false },

    safesMonyDisplay: { type: Boolean, default: false },
    safesMonyDelete: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('SafePermission', safePermissionSchema)
