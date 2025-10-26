import { FAIL } from './httpStatus.js'
import UserRefreshTokenModel from '../models/usersModels/UserRefreshTokenModel.js'
import jwt from 'jsonwebtoken'

export async function AuthrizationUser(req, res, next) {}
export async function authinticationUser(req, res, next) {
  try {
    const authToken = await req.headers['auth-token']
    const token = JSON.parse(authToken)
    const { refrechToken } = token
    const sessionId = jwt.verify(refrechToken, process.env.REFRECH_TOKEN)
    const existingSession = await UserRefreshTokenModel.findOne({
      sessionId,
    })
    const session = existingSession?.userId?.toString()
    if (session) {
      console.log(session)
      next()
    } else {
      return res.status(403).json({
        status: FAIL,
        message: 'Wrong you are not Authinticated',
      })
    }
  } catch (error) {}
}
