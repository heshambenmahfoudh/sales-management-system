import express from 'express'
import {
  CreateSale,
  deletedSaleById,
  getAllSales,
  getSaleById,
} from '../../services/salesService/SaleService.js'
import { authinticationUser } from '../../utils/authintication.js'

const saleRoute = express.Router()

// CREATE CATEGORY
saleRoute.post(
  '/sales',
  authinticationUser,
  CreateSale,
)

// DLETE BRAND
saleRoute.delete('/sales/:id', authinticationUser, deletedSaleById)

// GET BRAND
saleRoute.get('/sales/find/:id', authinticationUser, getSaleById)

// GET ALL BRAND
saleRoute.get('/sales', authinticationUser, getAllSales)

export default saleRoute
