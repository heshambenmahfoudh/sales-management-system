import express from 'express'
import {
  getSpendablePermissionByQuery,
  updatedSpendablePermissionById,
} from '../../services/permissionService/SpendablesPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const spendablePermissionRouter = express.Router()

spendablePermissionRouter.patch(
  '/users/spendables-permissions/:id',
  authinticationUser,
  updatedSpendablePermissionById,
)
spendablePermissionRouter.get(
  '/users/spendables-permissions',
  authinticationUser,
  getSpendablePermissionByQuery,
)
export default spendablePermissionRouter
