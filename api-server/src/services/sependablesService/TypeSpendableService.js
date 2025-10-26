import TypeSpendableModel from '../../models/spendablesModels/TypeSpendableModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateTypeSpendable(req, res, next) {
  const { title } = req.body
  try {
    const oldTypeSpendable = await TypeSpendableModel.findOne({ title })
    if (oldTypeSpendable) {
      return next(
        new ApiErr(FAIL, 403, `Type Spendable (${title}) Alredy Created `),
      )
    }
    const newTypeSpendable = await TypeSpendableModel.create({
      title,
    })
    const savedTypeSpendable = await newTypeSpendable.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `
      User (${session?.name}) Created New type spendable (${newTypeSpendable?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedTypeSpendable })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create TypeSpendable'))
  }
}

export async function getTypeSpendableById(req, res, next) {
  const { id } = req.params
  try {
    const typeSpendable = await TypeSpendableModel.findById(id)
    if (!typeSpendable) {
      return next(new ApiErr(FAIL, 403, ` typeSpendable Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: typeSpendable })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching TypeSpendable'))
  }
}

export async function updateTypeSpendableById(req, res, next) {
  const { id } = req.params
  const { title } = req.body

  try {
    const updatedTypeSpendable = await TypeSpendableModel.findByIdAndUpdate(
      id,
      { $set: { title } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `
      User (${session?.name}) Updated type spendable (${updatedTypeSpendable?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedTypeSpendable })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated TypeSpendable'))
  }
}

export async function deletedTypeSpendableById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await TypeSpendableModel.findById(id)
    await TypeSpendableModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted type spendable (${exist?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'TypeSpendable has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted TypeSpendable'))
  }
}

export async function getAllTypesSpendables(req, res, next) {
  const { name: title } = req.query

  const searchTitle = {}
  if (title) {
    searchTitle.title = {
      $regex: title,
    }
  }
  try {
    const typeSpendables = await TypeSpendableModel.find(searchTitle).sort({
      createdAt: -1,
    })
    res.status(200).json({ status: SUCCESS, data: typeSpendables })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching TypeSpendables'))
  }
}
