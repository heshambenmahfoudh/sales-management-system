import mongoose from 'mongoose'

export default async function databaseConnection() {
  await mongoose.connect(process.env.MONGODB)
  console.log('mongodb connected successfull... :)')
}
