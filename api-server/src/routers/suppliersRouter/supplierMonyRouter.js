import express from 'express'

import {
  deletedSuppliersMonyById,
  getAllSuppliersMony,
  getSupplierMonyById,
  updatedSuppliersMonyById,
} from '../../services/suppliersService/SupplierMonyService.js'
import { authinticationUser } from '../../utils/authintication.js'

const supplierMonyRoute = express.Router()

supplierMonyRoute.patch(
  '/suppliers/suppliers-mony/:id',
  authinticationUser,
  updatedSuppliersMonyById,
)

supplierMonyRoute.get(
  '/suppliers/suppliers-mony/find/:id',
  authinticationUser,
  getSupplierMonyById,
)

supplierMonyRoute.get(
  '/suppliers/suppliers-mony',
  authinticationUser,
  getAllSuppliersMony,
)

supplierMonyRoute.patch(
  '/suppliers/suppliers-mony/:id',
  authinticationUser,
  updatedSuppliersMonyById,
)

supplierMonyRoute.delete(
  '/suppliers/suppliers-mony/:id',
  authinticationUser,
  deletedSuppliersMonyById,
)

export default supplierMonyRoute
