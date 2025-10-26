import mongoose from 'mongoose'

const settingInvoiceSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
    },
    shopAddress: {
      type: String,
    },
    shopPhoneOne: {
      type: String,
    },
    shopPhoneTwo: {
      type: String,
    },
    shopterms: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
  },
  { timestamps: true },
)
export default mongoose.model('SettingInvoice', settingInvoiceSchema)
