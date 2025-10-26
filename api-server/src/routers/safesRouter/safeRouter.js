import express from 'express'
import {
  CreateSafe,
  deletedSafeById,
  getAllSafes,
  getSafeById,
  updatedSafeById,
} from '../../services/safesService/SafesService.js'
import { authinticationUser } from '../../utils/authintication.js'

const safeRoute = express.Router()

// CREATE CATEGORY
safeRoute.post('/safes', authinticationUser, CreateSafe)

// UPDATE CATEGORY
safeRoute.patch('/safes/:id', authinticationUser, updatedSafeById)

// DLETE CATEGORY
safeRoute.delete('/safes/:id', authinticationUser, deletedSafeById)

// GET CATEGORY
safeRoute.get('/safes/find/:id', authinticationUser, getSafeById)

// GET ALL CATEGORIES
safeRoute.get('/safes', authinticationUser, getAllSafes)

export default safeRoute
