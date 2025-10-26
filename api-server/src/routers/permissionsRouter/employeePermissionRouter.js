import express from 'express'
import {
  getEmployeePermissionByQuery,
  updatedEmployeePermissionById,
} from '../../services/permissionService/EmployeesPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const employeePermissionRouter = express.Router()

employeePermissionRouter.patch(
  '/users/employees-permissions/:id',
  authinticationUser,
  updatedEmployeePermissionById,
)
employeePermissionRouter.get(
  '/users/employees-permissions',
  authinticationUser,
  getEmployeePermissionByQuery,
)

export default employeePermissionRouter
