import express from 'express'
import {
  getPurchasePermissionByQuery,
  updatedPurchasePermissionById,
} from '../../services/permissionService/PurchasesPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const purchasePermissionRouter = express.Router()

purchasePermissionRouter.patch(
  '/users/purchases-permissions/:id',
  authinticationUser,
  updatedPurchasePermissionById,
)
purchasePermissionRouter.get(
  '/users/purchases-permissions',
  authinticationUser,
  getPurchasePermissionByQuery,
)

export default purchasePermissionRouter
