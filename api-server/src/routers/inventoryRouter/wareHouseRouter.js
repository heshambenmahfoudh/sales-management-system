import express from 'express'
import {
  CreateWareHouse,
  deletedWareHouseById,
  getAllWareHouses,
  getWareHouseById,
  updateWareHouseById,
} from '../../services/inventoryService/WareHouseService.js'
import { authinticationUser } from '../../utils/authintication.js'

const wareHouseRoute = express.Router()

// CREATE CATEGORY
wareHouseRoute.post(
  '/warehouses',
  authinticationUser,
  CreateWareHouse,
)

// UPDATE BRAND
wareHouseRoute.patch('/warehouses/:id', authinticationUser, updateWareHouseById)

// DLETE BRAND
wareHouseRoute.delete(
  '/warehouses/:id',
  authinticationUser,
  deletedWareHouseById,
)

// GET BRAND
wareHouseRoute.get('/warehouses/find/:id', authinticationUser, getWareHouseById)

// GET ALL BRAND
wareHouseRoute.get('/warehouses', authinticationUser, getAllWareHouses)

export default wareHouseRoute
