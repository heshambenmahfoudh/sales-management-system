import express from 'express'
import {
  CreatePurchase,
  deletedPurchaseById,
  getAllPurchases,
  getPurchaseById,
} from '../../services/purchasesService/PurchaseService.js'
import { authinticationUser } from '../../utils/authintication.js'

const purchaseRoute = express.Router()

// CREATE CATEGORY
purchaseRoute.post(
  '/purchases',
  authinticationUser,
  CreatePurchase,
)

// DLETE BRAND
purchaseRoute.delete('/purchases/:id', authinticationUser, deletedPurchaseById)

// GET BRAND
purchaseRoute.get('/purchases/find/:id', authinticationUser, getPurchaseById)

// GET ALL BRAND
purchaseRoute.get('/purchases', authinticationUser, getAllPurchases)

export default purchaseRoute
