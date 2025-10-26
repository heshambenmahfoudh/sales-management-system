import express from 'express'
import {
  CreateCustomer,
  deletedCustomerById,
  getAllCustomers,
  getCustomerById,
  updateCustomerById,
} from '../../services/customersService/CustomerService.js'
import { authinticationUser } from '../../utils/authintication.js'

const customerRoute = express.Router()

// CREATE CATEGORY
customerRoute.post(
  '/customers',
  authinticationUser,
  CreateCustomer,
)

// UPDATE BRAND
customerRoute.patch('/customers/:id', authinticationUser, updateCustomerById)

// DLETE BRAND
customerRoute.delete('/customers/:id', authinticationUser, deletedCustomerById)

// GET BRAND
customerRoute.get('/customers/find/:id', authinticationUser, getCustomerById)

// GET ALL BRAND
customerRoute.get('/customers', authinticationUser, getAllCustomers)

export default customerRoute
