import express from 'express'
import {
  createAccount,
  getServerUser,
  loginUser,
  logoutUser,
  setServerUser,
} from '../../services/usersService/AuthService.js'
import { authinticationUser } from '../../utils/authintication.js'

const authRouter = express.Router()

authRouter.post('/auth/register', authinticationUser, createAccount)
authRouter.post('/auth/login', loginUser)
authRouter.get('/auth/server-user', getServerUser)
authRouter.post('/auth/set-server-user', setServerUser)
authRouter.delete('/auth/logout-user', logoutUser)

export default authRouter
