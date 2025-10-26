import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import ApiErr from '../../utils/apiErr.js'
import { FAIL, SUCCESS, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateMonyPulled(req, res, next) {
  const { safe, mony, date, name, typePulled, notes } = req.body

  try {
    const check = await chechMonyInSafe(safe, mony)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }
    const newMonyPull = await MonyPulledModel.create({
      safe,
      mony,
      date,
      typePulled: 'manual pulled',
      name,
      notes,
    })
    await MoniesModel.updateOne(
      { safe },
      {
        $inc: { mony: -parseInt(mony) },
      },
    )
    const savedMonyPull = await newMonyPull.save()
    const session = await getUserSession(req, res, next)
    const existing = await SafeModel.findById(safe)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New pulled mony ($${mony}) from safe ($${existing?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedMonyPull })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Mony Pulled'))
  }
}

export async function getMonyPulledById(req, res, next) {
  const { id } = req.params
  try {
    const monyPulled = await MonyPulledModel.findById(id)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    if (!monyPulled) {
      return next(new ApiErr(FAIL, 403, ` monyPulled Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: monyPulled })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Mony Pulled'))
  }
}

export async function deletedMonyPulledById(req, res, next) {
  const { id } = req.params
  try {
   const exist =  await MonyPulledModel.findById(id)
   const existSafe =  await SafeModel.findById(exist?.safe)
    await MonyPulledModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted pulled mony ($${exist?.mony}) of safe (${existSafe?.title}) mony Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Mony Pulled has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Mony Pulled'))
  }
}

export async function getAllMonyPulleds(req, res, next) {
  const {  name } = req.query
  let searchByDateAndName = {}
  
  if (name) {
    searchByDateAndName.name = {
      $regex: name,
    }
  }
  try {
    const monyPulleds = await MonyPulledModel.find(searchByDateAndName)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    res.status(200).json({ status: SUCCESS, data: monyPulleds })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Mony Pulled'))
  }
}

/*FUNCTION*/

async function chechMonyInSafe(safe, mony, oldMony) {
  try {
    const existingSafe = await SafeModel.findById(safe)
    const existingMony = await MoniesModel.findOne({ safe })
    const safeName = existingMony?.safe

    let safeMony = 0
    if (oldMony) {
      safeMony = existingMony?.mony + oldMony
    } else {
      safeMony = existingMony?.mony
    }
    if (!safeName) {
      return {
        valid: false,
        message: `This Safe (${existingSafe?.title}) is Empty`,
      }
    }
    if (safeMony <= 0) {
      return {
        valid: false,
        message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
      }
    }
    if (mony > safeMony) {
      return {
        valid: false,
        message: `The Mony Pulled (${mony}) More Mony in The Safe (${existingSafe?.title}) `,
      }
    }
  } catch (err) {}
}
