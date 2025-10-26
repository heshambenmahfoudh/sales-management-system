import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
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
    image: {
      type: String,
    },
  },
  { timestamps: true },
)
export default mongoose.model('User', userSchema)
