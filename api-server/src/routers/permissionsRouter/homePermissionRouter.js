import express from 'express'
import {
  getHomePermissionByQuery,
  updatedHomePermissionById,
} from '../../services/permissionService/HomePermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const homePermissionRouter = express.Router()
// UPDATE USER
homePermissionRouter.patch(
  '/users/home-permissions/:id',
  authinticationUser,
  updatedHomePermissionById,
)
homePermissionRouter.get(
  '/users/home-permissions',
  authinticationUser,
  getHomePermissionByQuery,
)

export default homePermissionRouter
