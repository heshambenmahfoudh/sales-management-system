import CustomerPermissionModel from '../../models/permissionsModels/CustomerPermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function updatedCustomerPermissionById(req, res, next) {
  const { id: user } = req.params
  const {
    customersDataDisplay,
    customersDataCreate,
    customersDataUpdate,
    customersDataDelete,

    customersPaidDisplay,
    customersPaidUpdate,
    customersPaidDelete,

    customersDelayedDisplay,
    customersDelayedUpdate,
    customersDelayedDelete,
  } = req.body

  try {
    const updateCustomerPermission = await CustomerPermissionModel.updateOne(
      { user },
      {
        $set: {
          customersDataDisplay,
          customersDataCreate,
          customersDataUpdate,
          customersDataDelete,

          customersPaidDisplay,
          customersPaidUpdate,
          customersPaidDelete,

          customersDelayedDisplay,
          customersDelayedUpdate,
          customersDelayedDelete,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Customers Permission of user (${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateCustomerPermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Customer Permission '))
  }
}

export async function getCustomerPermissionByQuery(req, res, next) {
  const { user } = req.query

  try {
    const existingCustomerPermission = await CustomerPermissionModel.findOne({
      user,
    })
    if (!existingCustomerPermission) {
      return next(new ApiErr(FAIL, 402, 'Customers Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingCustomerPermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Customers Permission'))
  }
}
