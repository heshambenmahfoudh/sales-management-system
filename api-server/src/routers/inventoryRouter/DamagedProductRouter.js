import express from 'express'
import {
  CreateDamagedProduct,
  deletedDamagedProductById,
  getAllDamagedProducts,
  getDamagedProductById,
} from '../../services/inventoryService/DamagedProductService.js'
import { authinticationUser } from '../../utils/authintication.js'

const damagedProductRoute = express.Router()

// CREATE TRANSFER MONY
damagedProductRoute.post(
  '/products/damaged-products',
  authinticationUser,
  CreateDamagedProduct,
)

// DLETE TRANSFER MONY
damagedProductRoute.delete(
  '/products/damaged-products/:id',
  authinticationUser,
  deletedDamagedProductById,
)

// GET TRANSFER MONY
damagedProductRoute.get(
  '/products/damaged-products/find/:id',
  authinticationUser,
  getDamagedProductById,
)

// GET ALL TRANSFER MONY
damagedProductRoute.get(
  '/products/damaged-products',
  authinticationUser,
  getAllDamagedProducts,
)

export default damagedProductRoute
