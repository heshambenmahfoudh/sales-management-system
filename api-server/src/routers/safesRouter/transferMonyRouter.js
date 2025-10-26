import express from 'express'
import {
  CreateTransferMony,
  deletedTransferMonyById,
  getAllTransfersMony,
  getTransferMonyById,
} from '../../services/safesService/TransferMonyService.js'
import { authinticationUser } from '../../utils/authintication.js'

const transferMonyRoute = express.Router()

// CREATE TRANSFER MONY
transferMonyRoute.post(
  '/transfers-mony',
  authinticationUser,
  CreateTransferMony,
)

// DLETE TRANSFER MONY
transferMonyRoute.delete(
  '/transfers-mony/:id',
  authinticationUser,
  deletedTransferMonyById,
)

// GET TRANSFER MONY
transferMonyRoute.get(
  '/transfers-mony/find/:id',
  authinticationUser,
  getTransferMonyById,
)

// GET ALL TRANSFER MONY
transferMonyRoute.get('/transfers-mony', authinticationUser, getAllTransfersMony)

export default transferMonyRoute
