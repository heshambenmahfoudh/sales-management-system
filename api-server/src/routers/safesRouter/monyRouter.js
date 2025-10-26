import express from 'express'
import {
  deletedMonyById,
  getAllMonies,
  getMonyById,
} from '../../services/safesService/MoniesService.js'
import { authinticationUser } from '../../utils/authintication.js'

const monyRoute = express.Router()

// DLETE BRAND
monyRoute.delete('/monies/:id', authinticationUser, deletedMonyById)

// GET BRAND
monyRoute.get('/monies/find/:id', authinticationUser, getMonyById)

// GET ALL BRAND
monyRoute.get('/monies', authinticationUser, getAllMonies)

export default monyRoute
