import mongoose from 'mongoose'
const userrefrechTokenSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
    },
    userId: {
      type: String,
    },
    expiresAt: {
      type: String,
    },
  },
  { timestamps: true },
)
export default mongoose.model('UserRefrechToken', userrefrechTokenSchema)
