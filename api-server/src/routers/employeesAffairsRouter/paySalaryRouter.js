import express from 'express'
import {
  CreatePaySalary,
  deletedPaySalaryById,
  getAllPaySalaries,
  getPaySalaryById,
} from '../../services/employeesAffairsService/PaySalaryService.js'
import { authinticationUser } from '../../utils/authintication.js'

const paySalaryRoute = express.Router()

// CREATE CATEGORY
paySalaryRoute.post(
  '/employees/pay-salaries',
  authinticationUser,
  CreatePaySalary,
)

// // DLETE CATEGORY
paySalaryRoute.delete(
  '/employees/pay-salaries/:id',
  authinticationUser,
  deletedPaySalaryById,
)

// // GET CATEGORY
paySalaryRoute.get(
  '/employees/pay-salaries/find/:id',
  authinticationUser,
  getPaySalaryById,
)

// // GET ALL CATEGORIES
paySalaryRoute.get(
  '/employees/pay-salaries',
  authinticationUser,
  getAllPaySalaries,
)

export default paySalaryRoute
