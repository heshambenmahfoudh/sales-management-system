import express from 'express'
import {
  getSafePermissionByQuery,
  updatedSafePermissionById,
} from '../../services/permissionService/SafesPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const safePermissionRouter = express.Router()

safePermissionRouter.patch(
  '/users/safes-permissions/:id',
  authinticationUser,
  updatedSafePermissionById,
)
safePermissionRouter.get(
  '/users/safes-permissions',
  authinticationUser,
  getSafePermissionByQuery,
)

export default safePermissionRouter
