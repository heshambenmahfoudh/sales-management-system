import express from 'express'
import {
  CreateSupplier,
  deletedSupplierById,
  getAllSuppliers,
  getSupplierById,
  updateSupplierById,
} from '../../services/suppliersService/SupplierService.js'
import { authinticationUser } from '../../utils/authintication.js'

const supplierRoute = express.Router()

// CREATE CATEGORY
supplierRoute.post(
  '/suppliers',
  authinticationUser,
  CreateSupplier,
)

// UPDATE BRAND
supplierRoute.patch('/suppliers/:id', authinticationUser, updateSupplierById)

// DLETE BRAND
supplierRoute.delete('/suppliers/:id', authinticationUser, deletedSupplierById)

// GET BRAND
supplierRoute.get('/suppliers/find/:id', authinticationUser, getSupplierById)

// GET ALL BRAND
supplierRoute.get('/suppliers', authinticationUser, getAllSuppliers)

export default supplierRoute
