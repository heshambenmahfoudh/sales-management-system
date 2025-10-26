import SpendablePermissionModel from '../../models/permissionsModels/SpendablePermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export const updatedSpendablePermissionById = async (req, res, next) => {
  const { id: user } = req.params
  const {
    typeSpendablesDataDisplay,
    typeSpendablesDataCreate,
    typeSpendablesDataUpdate,
    typeSpendablesDataDelete,

    spendablesDataDisplay,
    spendablesDataCreate,
    spendablesDataView,
    spendablesDataDelete,

    bondsSpendablesDataDisplay,
    bondsSpendablesDataCreate,
    bondsSpendablesDataView,
    bondsSpendablesDataDelete,
    bondsSpendablesDataViewInvoice,

    bondsReceivablesDataDisplay,
    bondsReceivablesDataCreate,
    bondsReceivablesDataView,
    bondsReceivablesDataDelete,
    bondsReceivablesDataViewInvoice,
  } = req.body

  try {
    const updateSpendablePermission = await SpendablePermissionModel.updateOne(
      { user },
      {
        $set: {
          typeSpendablesDataDisplay,
          typeSpendablesDataCreate,
          typeSpendablesDataUpdate,
          typeSpendablesDataDelete,

          spendablesDataDisplay,
          spendablesDataCreate,
          spendablesDataView,
          spendablesDataDelete,

          bondsSpendablesDataDisplay,
          bondsSpendablesDataCreate,
          bondsSpendablesDataView,
          bondsSpendablesDataDelete,
          bondsSpendablesDataViewInvoice,

          bondsReceivablesDataDisplay,
          bondsReceivablesDataCreate,
          bondsReceivablesDataView,
          bondsReceivablesDataDelete,
          bondsReceivablesDataViewInvoice,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Spendables Permission of user (${existing?.name}) Successfully`,
    }
  await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateSpendablePermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Spendables Permission '))
  }
}

export const getSpendablePermissionByQuery = async (req, res, next) => {
  const { user } = req.query

  try {
    const existingSpendablePermission = await SpendablePermissionModel.findOne({
      user,
    })
    if (!existingSpendablePermission) {
      return next(new ApiErr(FAIL, 402, 'Spendables Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingSpendablePermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Spendables Permission'))
  }
}
