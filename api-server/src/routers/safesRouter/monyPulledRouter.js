import express from 'express'
import {
  CreateMonyPulled,
  deletedMonyPulledById,
  getAllMonyPulleds,
  getMonyPulledById,
} from '../../services/safesService/MonyPulledService.js'
import { authinticationUser } from '../../utils/authintication.js'

const monyPulledRoute = express.Router()

// CREATE CATEGORY
monyPulledRoute.post(
  '/mony-pulleds',
  authinticationUser,
  CreateMonyPulled,
)



// DLETE BRAND
monyPulledRoute.delete(
  '/mony-pulleds/:id',
  authinticationUser,
  deletedMonyPulledById,
)

// GET BRAND
monyPulledRoute.get(
  '/mony-pulleds/find/:id',
  authinticationUser,
  getMonyPulledById,
)

// GET ALL BRAND
monyPulledRoute.get('/mony-pulleds', authinticationUser, getAllMonyPulleds)

export default monyPulledRoute
