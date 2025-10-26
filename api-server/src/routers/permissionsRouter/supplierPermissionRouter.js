import express from 'express'
import {
  getSupplierPermissionByQuery,
  updatedSupplierPermissionById,
} from '../../services/permissionService/SuppliersPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const supplierPermissionRouter = express.Router()

supplierPermissionRouter.patch(
  '/users/suppliers-permissions/:id',
  authinticationUser,
  updatedSupplierPermissionById,
)
supplierPermissionRouter.get(
  '/users/suppliers-permissions',
  authinticationUser,
  getSupplierPermissionByQuery,
)

export default supplierPermissionRouter
