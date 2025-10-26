import bcrypt from 'bcrypt'

export async function bcryptPassword(data) {
  return await bcrypt.hashSync(data, 10)
}

export async function comparePassword(oldData, currentData) {
  return await bcrypt.compare(oldData, currentData)
}
