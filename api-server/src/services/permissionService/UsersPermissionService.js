import UserPermissionModel from '../../models/permissionsModels/UserPermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function updatedUserPermissionById(req, res, next) {
  const { id: user } = req.params
  const {
    userDataDisplay,
    userDataCreate,
    userDataUpdate,
    userDataDelete,
    userPermissionDisplay,
    userPermissionCreate,
    userPermissionUpdate,
    userPermissionDelete,
  } = req.body

  try {
    const updateUserPermission = await UserPermissionModel.updateOne(
      { user },
      {
        $set: {
          userDataDisplay,
          userDataCreate,
          userDataUpdate,
          userDataDelete,
          userPermissionDisplay,
          userPermissionCreate,
          userPermissionUpdate,
          userPermissionDelete,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Users Permission of user (${existing?.name}) Successfully`,
    }
  await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateUserPermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated User Permission '))
  }
}

export async function getUserPermissionByQuery(req, res, next) {
  const { user } = req.query

  try {
    const existingUserPermission = await UserPermissionModel.findOne({
      user,
    })
    if (!existingUserPermission) {
      return next(new ApiErr(FAIL, 402, 'User Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingUserPermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching User Permission'))
  }
}
