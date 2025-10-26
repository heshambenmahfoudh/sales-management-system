import express from 'express'
import {
  CreateTransferProduct,
  deletedTransferProductById,
  getAllTransferProducts,
  getTransferProductById,
} from '../../services/inventoryService/TransferProductService.js'
import { authinticationUser } from '../../utils/authintication.js'

const transferProductRoute = express.Router()

// CREATE TRANSFER MONY
transferProductRoute.post(
  '/products/transfer-products',
  authinticationUser,
  CreateTransferProduct,
)

// DLETE TRANSFER MONY
transferProductRoute.delete(
  '/products/transfer-products/:id',
  authinticationUser,
  deletedTransferProductById,
)

// GET TRANSFER MONY
transferProductRoute.get(
  '/products/transfer-products/find/:id',
  authinticationUser,
  getTransferProductById,
)

// GET ALL TRANSFER MONY
transferProductRoute.get(
  '/products/transfer-products',
  authinticationUser,
  getAllTransferProducts,
)

export default transferProductRoute
