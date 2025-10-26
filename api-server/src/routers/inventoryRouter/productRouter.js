import express from 'express'
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../../services/inventoryService/ProductService.js'
import { authinticationUser } from '../../utils/authintication.js'

const productRouter = express.Router()
// CREATE PRODUCT
productRouter.post(
  '/products',
  authinticationUser,
  createProduct,
)
// UPDATE PRODUCT
productRouter.patch('/products/:id', authinticationUser, updateProductById)
// DELETE PRODUCT
productRouter.delete('/products/:id', authinticationUser, deleteProductById)
// GET PRODUCT
productRouter.get('/products/find/:id', authinticationUser, getProductById)
// GET ALL PRODUCT
productRouter.get('/products/', authinticationUser, getAllProducts)

export default productRouter
