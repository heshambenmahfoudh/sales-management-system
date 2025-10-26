import MoniesModel from '../../models/safesModels/MoniesModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function getMonyById(req, res, next) {
  const { id } = req.params
  try {
    const mony = await MoniesModel.findById(id)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    if (!mony) {
      return next(new ApiErr(FAIL, 403, ` Mony Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: monyDeposite })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Mony'))
  }
}

export async function deletedMonyById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await MoniesModel.findById(id)
    const existSafe = await SafeModel.findById(exist?.safe)
    await MoniesModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Mony ($${exist?.mony}) of safe (${existSafe?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Mony has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Mony'))
  }
}

export async function getAllMonies(req, res, next) {
  try {
    const monies = await MoniesModel.find().populate({
      path: 'safe',
      select: 'title',
    })

    res.status(200).json({ status: SUCCESS, data: monies })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Monies'))
  }
}
