import mongoose from 'mongoose'

const userLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
    activity: {
      type: String,
    },
    ipAdress: {
      type: String,
    },
    device: {
      type: String,
    },
  },
  { timestamps: true },
)
export default mongoose.model('UserLog', userLogSchema)
