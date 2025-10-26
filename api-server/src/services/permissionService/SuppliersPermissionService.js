import SupplierPermissionModel from '../../models/permissionsModels/SupplierPermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export const updatedSupplierPermissionById = async (req, res, next) => {
  const { id: user } = req.params
  const {
    suppliersDataDisplay,
    suppliersDataCreate,
    suppliersDataUpdate,
    suppliersDataDelete,

    suppliersPaidDisplay,
    suppliersPaidUpdate,
    suppliersPaidDelete,

    suppliersDelayedDisplay,
    suppliersDelayedUpdate,
    suppliersDelayedDelete,
  } = req.body

  try {
    const updateSupplierPermission = await SupplierPermissionModel.updateOne(
      { user },
      {
        $set: {
          suppliersDataDisplay,
          suppliersDataCreate,
          suppliersDataUpdate,
          suppliersDataDelete,

          suppliersPaidDisplay,
          suppliersPaidUpdate,
          suppliersPaidDelete,

          suppliersDelayedDisplay,
          suppliersDelayedUpdate,
          suppliersDelayedDelete,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Suppliers Permission of user (${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateSupplierPermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Supplier Permission '))
  }
}

export const getSupplierPermissionByQuery = async (req, res, next) => {
  const { user } = req.query

  try {
    const existingSupplierPermission = await SupplierPermissionModel.findOne({
      user,
    })
    if (!existingSupplierPermission) {
      return next(new ApiErr(FAIL, 402, 'Suppliers Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingSupplierPermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Suppliers Permission'))
  }
}
