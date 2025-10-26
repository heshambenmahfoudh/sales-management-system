import UnitModel from '../../models/inventoryModels/UnitModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateUnit(req, res, next) {
  const { title } = req.body

  try {
    const oldUnit = await UnitModel.findOne({ title })
    if (oldUnit) {
      return next(new ApiErr(FAIL, 403, `Unit (${title}) Alredy Created `))
    }
    const newUnit = await UnitModel.create({
      title,
    })
    const savedUnit = await newUnit.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Unit (${newUnit?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedUnit })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Unit'))
  }
}

export async function getUnitById(req, res, next) {
  const { id } = req.params
  try {
    const unit = await UnitModel.findById(id)
    if (!unit) {
      return next(new ApiErr(FAIL, 403, ` Unit Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: unit })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Unit'))
  }
}

export async function updatedUnitById(req, res, next) {
  const { id } = req.params
  const { title } = req.body

  try {
    const updatedUnit = await UnitModel.findByIdAndUpdate(
      id,
      { $set: { title } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Unit (${updatedUnit?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedUnit })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Unit'))
  }
}

export async function deletedUnitById(req, res, next) {
  const { id } = req.params
  try {
    const existing = await UnitModel.findById(id)
    await UnitModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Unit (${existing?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Unit has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Unit'))
  }
}

export async function getAllUnits(req, res, next) {
  try {
    const units = await UnitModel.find().sort({ createdAt: -1 })
    res.status(200).json({ status: SUCCESS, data: units })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Units'))
  }
}
