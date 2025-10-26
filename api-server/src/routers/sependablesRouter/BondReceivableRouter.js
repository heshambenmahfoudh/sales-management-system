import express from 'express'
import {
  CreateBondReceivable,
  deletedBondReceivableById,
  getAllBondsReceivables,
  getBondReceivableById,
} from '../../services/sependablesService/BondReceivableService.js'
import { authinticationUser } from '../../utils/authintication.js'

const bondReceivableRoute = express.Router()

// CREATE TRANSFER MONY
bondReceivableRoute.post(
  '/spendables/bonds-receivables',
  authinticationUser,
  CreateBondReceivable,
)

// DLETE TRANSFER MONY
bondReceivableRoute.delete(
  '/spendables/bonds-receivables/:id',
  authinticationUser,
  deletedBondReceivableById,
)

// GET TRANSFER MONY
bondReceivableRoute.get(
  '/spendables/bonds-receivables/find/:id',
  authinticationUser,
  getBondReceivableById,
)

// GET ALL TRANSFER MONY
bondReceivableRoute.get(
  '/spendables/bonds-receivables',
  authinticationUser,
  getAllBondsReceivables,
)

export default bondReceivableRoute
