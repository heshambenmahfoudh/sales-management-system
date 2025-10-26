import express from 'express'
import {
  deletedCustomerMonyById,
  getAllCustomersMony,
  getCustomerMonyById,
  updatedCustomerMonyById,
} from '../../services/customersService/CustomerMonyService.js'
import { authinticationUser } from '../../utils/authintication.js'

const customerMonyRoute = express.Router()

// CREATE CATEGORY

customerMonyRoute.patch(
  '/customers/customers-mony/:id',
  authinticationUser,
  updatedCustomerMonyById,
)

customerMonyRoute.get(
  '/customers/customers-mony/find/:id',
  authinticationUser,
  getCustomerMonyById,
)

customerMonyRoute.get(
  '/customers/customers-mony',
  authinticationUser,
  getAllCustomersMony,
)

customerMonyRoute.delete(
  '/customers/customers-mony/:id',
  authinticationUser,
  deletedCustomerMonyById,
)

export default customerMonyRoute
