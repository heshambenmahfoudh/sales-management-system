import express from 'express'
import {
  CreateBrand,
  deletedBrandById,
  getAllBrands,
  getBrandById,
  updateBrandById,
} from '../../services/inventoryService/BrandService.js'
import { authinticationUser } from '../../utils/authintication.js'

const brandRoute = express.Router()

// CREATE CATEGORY
brandRoute.post('/brands', authinticationUser, CreateBrand)

// UPDATE BRAND
brandRoute.patch('/brands/:id', authinticationUser, updateBrandById)

// DLETE BRAND
brandRoute.delete('/brands/:id', authinticationUser, deletedBrandById)

// GET BRAND
brandRoute.get('/brands/find/:id', authinticationUser, getBrandById)

// GET ALL BRAND
brandRoute.get('/brands', authinticationUser, getAllBrands)

export default brandRoute
