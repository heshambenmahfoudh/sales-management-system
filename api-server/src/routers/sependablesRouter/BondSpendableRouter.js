import express from 'express'
import {
  CreateBondSpendable,
  deletedBondSpendableById,
  getAllBondsSpendables,
  getBondSpendableById,
} from '../../services/sependablesService/BondSpendableService.js'
import { authinticationUser } from '../../utils/authintication.js'

const bondSpendableRoute = express.Router()

// CREATE TRANSFER MONY
bondSpendableRoute.post(
  '/spendables/bonds-spendables',
  authinticationUser,
  CreateBondSpendable,
)

// DLETE TRANSFER MONY
bondSpendableRoute.delete(
  '/spendables/bonds-spendables/:id',
  authinticationUser,
  deletedBondSpendableById,
)

// GET TRANSFER MONY
bondSpendableRoute.get(
  '/spendables/bonds-spendables/find/:id',
  authinticationUser,
  getBondSpendableById,
)

// GET ALL TRANSFER MONY
bondSpendableRoute.get(
  '/spendables/bonds-spendables',
  authinticationUser,
  getAllBondsSpendables,
)

export default bondSpendableRoute
