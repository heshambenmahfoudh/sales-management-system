import SafeModel from '../../models/safesModels/SafeModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateSafe(req, res, next) {
  const { title } = req.body

  try {
    const oldSafe = await SafeModel.findOne({ title })
    if (oldSafe) {
      return next(new ApiErr(FAIL, 403, `Safe (${title}) Alredy Created `))
    }
    const customId = await generateOrderId()
    const newSafe = await SafeModel.create({
      _id: customId,
      title,
    })
    const savedSafe = await newSafe.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Safe (${newSafe?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedSafe })
  } catch (err) {
    // console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Safe'))
  }
}

export async function getSafeById(req, res, next) {
  const { id } = req.params
  try {
    const safe = await SafeModel.findById(id)
    if (!safe) {
      return next(new ApiErr(FAIL, 403, ` Safe Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: safe })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Safe'))
  }
}

export async function updatedSafeById(req, res, next) {
  const { id } = req.params
  const { title } = req.body

  try {
    const updatedSafe = await SafeModel.findByIdAndUpdate(
      id,
      { $set: { title } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Safe (${updatedSafe?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedSafe })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Safe'))
  }
}

export async function deletedSafeById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await SafeModel.findById(id)
    await SafeModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Safe (${exist?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Safe has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Safe'))
  }
}

export async function getAllSafes(req, res, next) {
  try {
    const safes = await SafeModel.find()
    res.status(200).json({ status: SUCCESS, data: safes })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Safes'))
  }
}

/* FUNCTION */

async function generateOrderId() {
  try {
    const lastNumber = await SafeModel.findOne().sort({ _id: -1 })
    const newNumber = lastNumber ? parseInt(lastNumber._id) + 1 : 1
    return newNumber
  } catch (error) {}
}
