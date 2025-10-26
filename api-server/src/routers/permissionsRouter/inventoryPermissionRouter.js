import express from 'express'
import {
  getInventoryPermissionByQuery,
  updatedInventoryPermissionById,
} from '../../services/permissionService/InventoryPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const inventoryPermissionRouter = express.Router()

inventoryPermissionRouter.patch(
  '/users/inventory-permissions/:id',
  authinticationUser,
  updatedInventoryPermissionById,
)
inventoryPermissionRouter.get(
  '/users/inventory-permissions',
  authinticationUser,
  getInventoryPermissionByQuery,
)

export default inventoryPermissionRouter
