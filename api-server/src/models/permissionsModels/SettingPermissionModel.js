import mongoose from 'mongoose'

const settingPermissionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    SettingInvoiceData: { type: Boolean, default: false },
    SettingProfileData: { type: Boolean, default: false },
  },
  { timestamps: true },
)
export default mongoose.model('settingPermission', settingPermissionSchema)
