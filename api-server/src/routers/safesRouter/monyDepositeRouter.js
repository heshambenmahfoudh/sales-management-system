import express from 'express'
import {
  CreateMonyDeposite,
  deletedMonyDepositeById,
  getAllMonyDeposites,
  getMonyDepositeById,
} from '../../services/safesService/MonyDepositeService.js'
import { authinticationUser } from '../../utils/authintication.js'

const monyDepositeRoute = express.Router()

// CREATE CATEGORY
monyDepositeRoute.post(
  '/mony-deposites',
  authinticationUser,
  CreateMonyDeposite,
)



// DLETE BRAND
monyDepositeRoute.delete(
  '/mony-deposites/:id',
  authinticationUser,
  deletedMonyDepositeById,
)

// GET BRAND
monyDepositeRoute.get(
  '/mony-deposites/find/:id',
  authinticationUser,
  getMonyDepositeById,
)

// GET ALL BRAND
monyDepositeRoute.get('/mony-deposites', authinticationUser, getAllMonyDeposites)

export default monyDepositeRoute
