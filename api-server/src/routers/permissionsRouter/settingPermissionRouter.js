import express from 'express'
import {
  getSettingPermissionByQuery,
  updatedSettingPermissionById,
} from '../../services/permissionService/SettingsPermissionService.js'
import { authinticationUser } from '../../utils/authintication.js'

const settingPermissionRouter = express.Router()

settingPermissionRouter.patch(
  '/users/settings-permissions/:id',
  authinticationUser,
  updatedSettingPermissionById,
)
settingPermissionRouter.get(
  '/users/settings-permissions',
  authinticationUser,
  getSettingPermissionByQuery,
)

export default settingPermissionRouter
