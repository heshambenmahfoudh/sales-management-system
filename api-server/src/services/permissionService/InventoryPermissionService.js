import InventoryPermissionModel from '../../models/permissionsModels/InventoryPermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function updatedInventoryPermissionById(req, res, next) {
  const { id: user } = req.params
  const {
    productsDataDisplay,
    productsDataCreate,
    productsDataUpdate,
    productsDataDelete,

    categoriesDataDisplay,
    categoriesDataCreate,
    categoriesDataUpdate,
    categoriesDataDelete,

    brandsDataDisplay,
    brandsDataCreate,
    brandsDataUpdate,
    brandsDataDelete,

    unitsDataDisplay,
    unitsDataCreate,
    unitsDataUpdate,
    unitsDataDelete,

    wareHousesDataDisplay,
    wareHousesDataCreate,
    wareHousesDataUpdate,
    wareHousesDataDelete,

    productsQuantitaesDataDisplay,
    productsQuantitaesDataCreate,
    productsQuantitaesDataDelete,

    productsTransfersDataDisplay,
    productsTransfersDataCreate,
    productsTransfersDataView,
    productsTransfersDataDelete,

    productsDamagedDataDisplay,
    productsDamagedDataCreate,
    productsDamagedDataView,
    productsDamagedDataDelete,
  } = req.body

  try {
    const updateInventoryPermission = await InventoryPermissionModel.updateOne(
      { user },
      {
        $set: {
          productsDataDisplay,
          productsDataCreate,
          productsDataUpdate,
          productsDataDelete,

          categoriesDataDisplay,
          categoriesDataCreate,
          categoriesDataUpdate,
          categoriesDataDelete,

          brandsDataDisplay,
          brandsDataCreate,
          brandsDataUpdate,
          brandsDataDelete,

          unitsDataDisplay,
          unitsDataCreate,
          unitsDataUpdate,
          unitsDataDelete,

          wareHousesDataDisplay,
          wareHousesDataCreate,
          wareHousesDataUpdate,
          wareHousesDataDelete,

          productsQuantitaesDataDisplay,
          productsQuantitaesDataCreate,
          productsQuantitaesDataDelete,

          productsTransfersDataDisplay,
          productsTransfersDataCreate,
          productsTransfersDataView,
          productsTransfersDataDelete,

          productsDamagedDataDisplay,
          productsDamagedDataCreate,
          productsDamagedDataView,
          productsDamagedDataDelete,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Inventory Permission of user (${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateInventoryPermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Inventory Permission '))
  }
}

export async function getInventoryPermissionByQuery(req, res, next) {
  const { user } = req.query

  try {
    const existingInventoryPermission = await InventoryPermissionModel.findOne({
      user,
    })

    if (!existingInventoryPermission) {
      return next(new ApiErr(FAIL, 402, 'Inventory Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingInventoryPermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Inventory Permission'))
  }
}
