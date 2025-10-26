import express from 'express'
import {
  CreateWithdrawals,
  deletedWithdrawalseById,
  getAllWithdrawals,
  getWithdrawalsById,
} from '../../services/employeesAffairsService/WithdrawalsService.js'
import { authinticationUser } from '../../utils/authintication.js'

const withdrawalsRouter = express.Router()

// REGISTER USER
withdrawalsRouter.post(
  '/employees/withdrawals',
  authinticationUser,
  CreateWithdrawals,
)

withdrawalsRouter.delete(
  '/employees/withdrawals/:id',
  authinticationUser,
  deletedWithdrawalseById,
)

// // GET TRANSFER MONY
withdrawalsRouter.get(
  '/employees/withdrawals/find/:id',
  authinticationUser,
  getWithdrawalsById,
)

// // GET ALL TRANSFER MONY
withdrawalsRouter.get(
  '/employees/withdrawals',
  authinticationUser,
  getAllWithdrawals,
)

export default withdrawalsRouter
