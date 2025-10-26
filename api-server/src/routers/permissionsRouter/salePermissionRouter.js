import express from 'express'
import {
  getSalePermissionByQuery,
  updatedSalePermissionById,
} from '../../services/permissionService/SalesPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const salePermissionRouter = express.Router()

salePermissionRouter.patch(
  '/users/sales-permissions/:id',
  authinticationUser,
  updatedSalePermissionById,
)
salePermissionRouter.get(
  '/users/sales-permissions',
  authinticationUser,
  getSalePermissionByQuery,
)

export default salePermissionRouter
