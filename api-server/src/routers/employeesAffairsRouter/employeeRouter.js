import express from 'express'
import {
  CreateEmployee,
  deletedEmployeeById,
  getAllEmployees,
  getEmployeeById,
  updatedEmployeeById,
} from '../../services/employeesAffairsService/EmployeeService.js'
import { authinticationUser } from '../../utils/authintication.js'

const employeeRoute = express.Router()

// CREATE CATEGORY
employeeRoute.post(
  '/employees',
  authinticationUser,
  CreateEmployee,
)

// UPDATE CATEGORY
employeeRoute.patch('/employees/:id', authinticationUser, updatedEmployeeById)

// // DLETE CATEGORY
employeeRoute.delete('/employees/:id', authinticationUser, deletedEmployeeById)

// // GET CATEGORY
employeeRoute.get('/employees/find/:id', authinticationUser, getEmployeeById)

// // GET ALL CATEGORIES
employeeRoute.get('/employees', authinticationUser, getAllEmployees)

export default employeeRoute
