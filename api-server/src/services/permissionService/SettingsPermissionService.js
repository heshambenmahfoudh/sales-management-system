import SettingPermissionModel from '../../models/permissionsModels/SettingPermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function updatedSettingPermissionById(req, res, next) {
  const { id: user } = req.params
  const { SettingInvoiceData, SettingProfileData } = req.body

  try {
    const updateSettingPermission = await SettingPermissionModel.updateOne(
      { user },
      {
        $set: {
          SettingInvoiceData,
          SettingProfileData,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Settings Permission of user (${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateSettingPermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Setting Permission '))
  }
}

export async function getSettingPermissionByQuery(req, res, next) {
  const { user } = req.query
  try {
    const existingSettingPermission = await SettingPermissionModel.findOne({
      user,
    })
    if (!existingSettingPermission) {
      return next(new ApiErr(FAIL, 402, 'Settings Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingSettingPermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Settings Permission'))
  }
}
