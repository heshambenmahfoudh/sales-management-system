import express from 'express'
import {
  CreateTypeSpendable,
  deletedTypeSpendableById,
  getAllTypesSpendables,
  getTypeSpendableById,
  updateTypeSpendableById,
} from '../../services/sependablesService/TypeSpendableService.js'
import { authinticationUser } from '../../utils/authintication.js'

const typeSpendableRoute = express.Router()

// CREATE CATEGORY
typeSpendableRoute.post(
  '/type-spendables',
  authinticationUser,
  CreateTypeSpendable,
)

// UPDATE CATEGORY
typeSpendableRoute.patch(
  '/type-spendables/:id',
  authinticationUser,
  updateTypeSpendableById,
)

// DLETE CATEGORY
typeSpendableRoute.delete(
  '/type-spendables/:id',
  authinticationUser,
  deletedTypeSpendableById,
)

// GET CATEGORY
typeSpendableRoute.get(
  '/type-spendables/find/:id',
  authinticationUser,
  getTypeSpendableById,
)

// GET ALL CATEGORIES
typeSpendableRoute.get(
  '/type-spendables',
  authinticationUser,
  getAllTypesSpendables,
)

export default typeSpendableRoute
