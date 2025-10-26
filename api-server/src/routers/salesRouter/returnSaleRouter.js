import express from 'express'
import {
  CreateReturnSale,
  deletedReturnSaleById,
  getAllReturnsales,
  getReturnSaleById,
} from '../../services/salesService/ReturnSaleService.js'
import { authinticationUser } from '../../utils/authintication.js'

const returnSaleRouter = express.Router()

// REGISTER USER
returnSaleRouter.post(
  '/sales/sales-return',
  authinticationUser,
  CreateReturnSale,
)

// LOGIN USER
returnSaleRouter.delete(
  '/sales/sales-return/:id',
  authinticationUser,
  deletedReturnSaleById,
)

// FORGOT PASS
returnSaleRouter.get(
  '/sales/sales-return/find/:id',
  authinticationUser,
  getReturnSaleById,
)
// FORGOT PASS
returnSaleRouter.get(
  '/sales/sales-return',
  authinticationUser,
  getAllReturnsales,
)
export default returnSaleRouter
