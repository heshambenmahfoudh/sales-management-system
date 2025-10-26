import express from 'express'
import {
  CreateProductQty,
  deletedProductQtyById,
  getAllProductsQty,
  getProductQtyById,
} from '../../services/inventoryService/ProductQtyService.js'
import { authinticationUser } from '../../utils/authintication.js'

const productsQtyRoute = express.Router()

// CREATE CATEGORY
productsQtyRoute.post(
  '/products/products-quantities',
  authinticationUser,
  CreateProductQty,
)

// DLETE BRAND
productsQtyRoute.delete(
  '/products/products-quantities/:id',
  authinticationUser,
  deletedProductQtyById,
)

// GET BRAND
productsQtyRoute.get(
  '/products/products-quantities/find/:id',
  authinticationUser,
  getProductQtyById,
)

// GET ALL BRAND
productsQtyRoute.get(
  '/products/products-quantities',
  authinticationUser,
  getAllProductsQty,
)

export default productsQtyRoute
