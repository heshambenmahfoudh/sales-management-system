import SafePermissionModel from '../../models/permissionsModels/SafePermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'


export async function updatedSafePermissionById (req, res, next){
  const { id: user } = req.params
  const {
    safesDataDisplay,
    safesDataCreate,
    safesDataUpdate,
    safesDataDelete,

    safesDepositsDisplay,
    safesDepositsCreate,
    safesDepositsView,
    safesDepositsDelete,

    safesPulledDisplay,
    safesPulledCreate,
    safesPulledView,
    safesPulledDelete,

    safesTransfersDisplay,
    safesTransfersCreate,
    safesTransfersView,
    safesTransfersDelete,

    safesMonyDisplay,
    safesMonyDelete,
  } = req.body


  try {
    const updateSafePermission = await SafePermissionModel.updateOne(
      {user},
      {
        $set: {
          safesDataDisplay,
          safesDataCreate,
          safesDataUpdate,
          safesDataDelete,

          safesDepositsDisplay,
          safesDepositsCreate,
          safesDepositsView,
          safesDepositsDelete,

          safesPulledDisplay,
          safesPulledCreate,
          safesPulledView,
          safesPulledDelete,

          safesTransfersDisplay,
          safesTransfersCreate,
          safesTransfersView,
          safesTransfersDelete,

          safesMonyDisplay,
          safesMonyDelete,
        },
      },
      { new: true },
    )
 const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Safes Permission of user (${existing?.name}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateSafePermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Safes Permission '))
  }
}

export async function getSafePermissionByQuery (req, res, next){
  const { user } = req.query

  try {
    const existingSafePermission = await SafePermissionModel.findOne({
      user,
    })

    if (!existingSafePermission) {
      return next(new ApiErr(FAIL, 402, 'Safe Permission Not Found'))
    }

    res.status(200).json({ status: SUCCESS, data: existingSafePermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Safe Permission'))
  }
}
