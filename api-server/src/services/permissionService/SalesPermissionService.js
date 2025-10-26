import SalePermissionModel from '../../models/permissionsModels/SalePermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

// UPDATED USER
export async function updatedSalePermissionById(req, res, next) {
  const { id: user } = req.params
  const {
    salesDataDisplay,
    salesDataCreate,
    salesDataUpdate,
    salesDataDelete,
    salesDataViewInvoice,

    salesReturnDisplay,
    salesReturnCreate,
    salesReturnUpdate,
    salesReturnDelete,
    salesReturnViewInvoice,

    salesEarningDisplay,
    salesEarningDelete,
    salesEarningInvoice,
  } = req.body

  try {
    const updateSalePermission = await SalePermissionModel.updateOne(
      { user },
      {
        $set: {
          salesDataDisplay,
          salesDataCreate,
          salesDataUpdate,
          salesDataDelete,
          salesDataViewInvoice,

          salesReturnDisplay,
          salesReturnCreate,
          salesReturnUpdate,
          salesReturnDelete,
          salesReturnViewInvoice,

          salesEarningDisplay,
          salesEarningDelete,
          salesEarningInvoice,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Sales Permission of user (${existing?.name}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateSalePermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Sales Permission '))
  }
}

export async function getSalePermissionByQuery(req, res, next) {
  const { user } = req.query

  try {
    const existingSalePermission = await SalePermissionModel.findOne({
      user,
    })

    if (!existingSalePermission) {
      return next(new ApiErr(FAIL, 402, 'Sale Permission Not Found'))
    }

    res.status(200).json({ status: SUCCESS, data: existingSalePermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Sale Permission'))
  }
}
