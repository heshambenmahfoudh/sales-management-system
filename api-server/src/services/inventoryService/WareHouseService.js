import WareHouseModel from '../../models/inventoryModels/WareHouseModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateWareHouse(req, res, next) {
  const { warehouseType, title, location, description } = req.body
  try {
    const oldWareHouse = await WareHouseModel.findOne({ title })
    if (oldWareHouse) {
      return next(new ApiErr(FAIL, 403, `WareHouse (${title}) Alredy Created `))
    }
    const newWareHouse = await WareHouseModel.create({
      warehouseType,
      title,
      location,
      description,
    })
    const savedWareHouse = await newWareHouse.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New wareHouse 
       (${newWareHouse.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedWareHouse })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create WareHouse'))
  }
}

export async function getWareHouseById(req, res, next) {
  const { id } = req.params
  try {
    const wareHouse = await WareHouseModel.findById(id)
    if (!wareHouse) {
      return next(new ApiErr(FAIL, 403, `WareHouse Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: wareHouse })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching WareHouse'))
  }
}

export async function updateWareHouseById(req, res, next) {
  const { id } = req.params
  const { warehouseType, title, location, description } = req.body
  try {
    const updatedWareHouse = await WareHouseModel.findByIdAndUpdate(
      id,
      { $set: { warehouseType, title, location, description } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated wareHouse 
       (${updatedWareHouse.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedWareHouse })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated WareHouse'))
  }
}

export async function deletedWareHouseById(req, res, next) {
  const { id } = req.params
  try {
    const existingWarehouse = await WareHouseModel.findById(id)
    await WareHouseModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted wareHouse 
       (${existingWarehouse.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'WareHouse has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted WareHouse'))
  }
}

export async function getAllWareHouses(req, res, next) {
  try {
    const wareHouses = await WareHouseModel.find()
    res.status(200).json({ status: SUCCESS, data: wareHouses })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching WareHouses'))
  }
}
