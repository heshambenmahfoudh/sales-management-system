import express from 'express'
import { authinticationUser } from '../../utils/authintication.js'

import {
  deleteUserLogById,
  getUserLogs,
} from '../../services/usersService/UserLogService.js'

const userLogRouter = express.Router()

// DELETE USER
userLogRouter.delete(
  '/users/user-logs/:id',
  authinticationUser,
  deleteUserLogById,
)

// GET ALL USER
userLogRouter.get('/users/user-logs', authinticationUser, getUserLogs)

export default userLogRouter
