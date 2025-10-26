import express from 'express'
import { authinticationUser } from '../../utils/authintication.js'
import {
  deleteUserById,
  getAllUsers,
  getUserById,
  updatedUserById,
  updatedUserprofileById,
} from '../../services/usersService/UserService.js'

const userRouter = express.Router()
// UPDATE USER
userRouter.patch('/users/:id', authinticationUser, updatedUserById)

userRouter.patch(
  '/users/user-profile/:id',
  authinticationUser,
  updatedUserprofileById,
)
// DELETE USER
userRouter.delete('/users/:id', authinticationUser, deleteUserById)
// GET USER
userRouter.get('/users/find/:id', authinticationUser, getUserById)
// GET ALL USER
userRouter.get('/users', authinticationUser, getAllUsers)

export default userRouter
