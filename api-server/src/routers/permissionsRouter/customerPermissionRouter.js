import express from 'express'
import {
  getCustomerPermissionByQuery,
  updatedCustomerPermissionById,
} from '../../services/permissionService/CustomersPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const customerPermissionRouter = express.Router()

customerPermissionRouter.patch(
  '/users/customers-permissions/:id',
  authinticationUser,
  updatedCustomerPermissionById,
)
customerPermissionRouter.get(
  '/users/customers-permissions',
  authinticationUser,
  getCustomerPermissionByQuery,
)

export default customerPermissionRouter
