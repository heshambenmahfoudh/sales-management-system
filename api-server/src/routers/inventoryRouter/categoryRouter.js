import express from 'express'
import {
  CreateCategory,
  deletedCategoryById,
  getAllCategory,
  getCategoryById,
  updatedCategoryById,
} from '../../services/inventoryService/CategoryService.js'
import { authinticationUser } from '../../utils/authintication.js'

const categoryRoute = express.Router()

// CREATE CATEGORY
categoryRoute.post(
  '/categories',
  authinticationUser,
  CreateCategory,
)

// UPDATE CATEGORY
categoryRoute.patch('/categories/:id', authinticationUser, updatedCategoryById)

// DLETE CATEGORY
categoryRoute.delete('/categories/:id', authinticationUser, deletedCategoryById)

// GET CATEGORY
categoryRoute.get('/categories/find/:id', authinticationUser, getCategoryById)

// GET ALL CATEGORIES
categoryRoute.get('/categories', authinticationUser, getAllCategory)

export default categoryRoute
