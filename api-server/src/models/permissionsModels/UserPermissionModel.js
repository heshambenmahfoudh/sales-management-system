import mongoose from 'mongoose'

const userPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    userDataDisplay: { type: Boolean, default: false },
    userDataCreate: { type: Boolean, default: false },
    userDataUpdate: { type: Boolean, default: false },
    userDataDelete: { type: Boolean, default: false },
    userPermissionDisplay: { type: Boolean, default: false },
    userPermissionCreate: { type: Boolean, default: false },
    userPermissionUpdate: { type: Boolean, default: false },
    userPermissionDelete: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('UserPermission', userPermissionSchema)
