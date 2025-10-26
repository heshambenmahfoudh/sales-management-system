import express from 'express'

import {
  CreateUnit,
  deletedUnitById,
  getAllUnits,
  getUnitById,
  updatedUnitById,
} from '../../services/inventoryService/UnitService.js'
import { authinticationUser } from '../../utils/authintication.js'

const unitRoute = express.Router()

// CREATE CATEGORY
unitRoute.post('/units', authinticationUser, CreateUnit)

// UPDATE CATEGORY
unitRoute.patch('/units/:id', authinticationUser, updatedUnitById)

// DLETE CATEGORY
unitRoute.delete('/units/:id', authinticationUser, deletedUnitById)

// GET CATEGORY
unitRoute.get('/units/find/:id', authinticationUser, getUnitById)

// GET ALL CATEGORIES
unitRoute.get('/units', authinticationUser, getAllUnits)

export default unitRoute
