import mongoose from 'mongoose'

const homePermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    homeDisplay: {
      type: Boolean,
      default: false,
    },
    logDisplay: {
      type: Boolean,
      default: false,
    },
    logDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)
export default mongoose.model('HomePermission', homePermissionSchema)
