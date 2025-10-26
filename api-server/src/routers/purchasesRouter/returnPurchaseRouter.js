import express from 'express'
import {
  CreateReturnPurchase,
  deletedReturnPurchaseById,
  getAllReturnsPurchases,
  getReturnPurchaseById,
} from '../../services/purchasesService/ReturnPurchaseService.js'
import { authinticationUser } from '../../utils/authintication.js'

const returnPurchaseRouter = express.Router()

// REGISTER USER
returnPurchaseRouter.post(
  '/purchases/purchases-return',
  authinticationUser,
  CreateReturnPurchase,
)

// LOGIN USER
returnPurchaseRouter.delete(
  '/purchases/purchases-return/:id',
  authinticationUser,
  deletedReturnPurchaseById,
)

// FORGOT PASS
returnPurchaseRouter.get(
  '/purchases/purchases-return/find/:id',
  authinticationUser,
  getReturnPurchaseById,
)
// FORGOT PASS
returnPurchaseRouter.get(
  '/purchases/purchases-return',
  authinticationUser,
  getAllReturnsPurchases,
)
export default returnPurchaseRouter
