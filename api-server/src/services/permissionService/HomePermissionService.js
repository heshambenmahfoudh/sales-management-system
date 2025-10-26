import HomePermissionModel from '../../models/permissionsModels/HomePermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function updatedHomePermissionById(req, res, next) {
  const { id: user } = req.params
  const { homeDisplay } = req.body

  try {
    const updateHomePermission = await HomePermissionModel.updateOne(
      {user},
      {
        $set: { homeDisplay },
      },
      { new: true },
    )
 const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Dashboard Permission of user (${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateHomePermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Home Permission '))
  }
}

export async function getHomePermissionByQuery(req, res, next) {
  const { user } = req.query

  try {
    const existingHomePermission = await HomePermissionModel.findOne({
      user,
    })

    if (!existingHomePermission) {
      return next(new ApiErr(FAIL, 402, 'Home Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingHomePermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Home Permission'))
  }
}
