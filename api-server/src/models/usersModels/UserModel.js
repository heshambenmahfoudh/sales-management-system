import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },

    imageUrl: {
      type: String,
    },
    role: {
      type: String,
      default: 'USER',
    },
  },
  { timestamps: true },
)
export default mongoose.model('User', userSchema)
