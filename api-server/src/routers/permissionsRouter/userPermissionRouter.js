import express from 'express'
import {
  getUserPermissionByQuery,
  updatedUserPermissionById,
} from '../../services/permissionService/UsersPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const userPermissionRouter = express.Router()

userPermissionRouter.patch(
  '/users/users-permissions/:id',
  authinticationUser,
  updatedUserPermissionById,
)

userPermissionRouter.get(
  '/users/users-permissions',
  authinticationUser,
  getUserPermissionByQuery,
)

export default userPermissionRouter
