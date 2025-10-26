import PurchasePermissionModel from '../../models/permissionsModels/PurchasePermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'


export async function updatedPurchasePermissionById (req, res, next){
  const { id: user } = req.params
  const {
    purchasesDataDisplay,
    purchasesDataCreate,
    purchasesDataUpdate,
    purchasesDataDelete,
    purchasesDataViewInvoice,

    purchasesReturnDisplay,
    purchasesReturnCreate,
    purchasesReturnUpdate,
    purchasesReturnDelete,
    purchasesReturnViewInvoice,
  } = req.body

  
  try {
    const updatePurchasePermission = await PurchasePermissionModel.updateOne(
      {user},
      {
        $set: {
          purchasesDataDisplay,
          purchasesDataCreate,
          purchasesDataUpdate,
          purchasesDataDelete,
          purchasesDataViewInvoice,

          purchasesReturnDisplay,
          purchasesReturnCreate,
          purchasesReturnUpdate,
          purchasesReturnDelete,
          purchasesReturnViewInvoice,
        },
      },
      { new: true },
    )
 const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Purchases Permission of user (${existing?.name}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updatePurchasePermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Purchase Permission '))
  }
}

export async function getPurchasePermissionByQuery (req, res, next){
  const { user } = req.query

  try {
   
   
    const existingPurchasePermission = await PurchasePermissionModel.findOne({
      user,
    })

    
    if (!existingPurchasePermission) {
      return next(new ApiErr(FAIL, 402, 'Purchase Permission Not Found'))
    }

    res.status(200).json({ status: SUCCESS, data: existingPurchasePermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Purchase Permission'))
  }
}
