import express from 'express'
import {
  CreateSpendable,
  deletedSpendableById,
  getAllSpendables,
  getSpendableById,
} from '../../services/sependablesService/SpendableService.js'
import { authinticationUser } from '../../utils/authintication.js'

const spendableRoute = express.Router()

spendableRoute.post(
  '/spendables',
  authinticationUser,
  CreateSpendable,
)


spendableRoute.delete(
  '/spendables/:id',
  authinticationUser,
  deletedSpendableById,
)

spendableRoute.get('/spendables/find/:id', authinticationUser, getSpendableById)

spendableRoute.get('/spendables', authinticationUser, getAllSpendables)

export default spendableRoute
