import jwt from 'jsonwebtoken'

export async function generateAccessToken(data) {
  return await jwt.sign(data, process.env.ACCESS_TOKEN)
}
export async function generateRefrechToken(data) {
  return await jwt.sign(data, process.env.REFRECH_TOKEN)
}
