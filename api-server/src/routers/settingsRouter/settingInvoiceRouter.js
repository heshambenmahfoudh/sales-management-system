import express from 'express'
import {
  getSettingInvoice,
  updateSettingInvoiceById,
} from '../../services/settingsService/SettingInvoiceService.js'
import { authinticationUser } from '../../utils/authintication.js'

const settingInvoiceRoute = express.Router()

settingInvoiceRoute.patch(
  '/settings/setting-invoice/:id',
  authinticationUser,
  updateSettingInvoiceById,
)

settingInvoiceRoute.get(
  '/settings/setting-invoice',
  authinticationUser,
  getSettingInvoice,
)

export default settingInvoiceRoute
