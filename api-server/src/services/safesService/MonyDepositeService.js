import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyDepositeModel from '../../models/safesModels/MonyDepositeModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateMonyDeposite(req, res, next) {
  const { safe, mony, date, name, notes } = req.body

  try {
    const newMonyDeposite = await MonyDepositeModel.create({
      safe,
      mony,
      date,
      typeDeposite: 'manual deposite',
      name,
      notes,
    })

    let newMony
    const existingMony = await MoniesModel.find({ safe })
    if (existingMony?.length > 0) {
      await MoniesModel.updateOne(
        { safe },
        {
          $inc: { mony: parseInt(mony) },
        },
        { new: true },
      )
    } else {
      newMony = await MoniesModel.create({
        safe,
        mony: parseInt(mony),
      })
    }

    const savedMony = await newMony?.save()
    const savedMonyDeposite = await newMonyDeposite.save()
    const session = await getUserSession(req, res, next)
    const existing = await SafeModel.findById(safe)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New deposite mony ($${mony}) to safe (${existing?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res
      .status(200)
      .json({ status: SUCCESS, data: savedMonyDeposite, savedMony })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Mony Deposite'))
  }
}

export async function getMonyDepositeById(req, res, next) {
  const { id } = req.params
  try {
    const monyDeposite = await MonyDepositeModel.findById(id)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    if (!monyDeposite) {
      return next(new ApiErr(FAIL, 403, ` Mony Deposite Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: monyDeposite })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Mony Deposite'))
  }
}

export async function deletedMonyDepositeById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await MonyDepositeModel.findById(id)
    const existSafe = await SafeModel.findById(exist?.safe)
    await MonyDepositeModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted deposite mony ($${exist?.mony}) of safe (${existSafe?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Mony Deposite has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Mony Deposite'))
  }
}

export async function getAllMonyDeposites(req, res, next) {
  const { name } = req.query
  let searchByDateAndName = {}

  if (name) {
    searchByDateAndName.name = {
      $regex: name,
    }
  }

  try {
    const monyDeposite = await MonyDepositeModel.find(searchByDateAndName)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    res.status(200).json({ status: SUCCESS, data: monyDeposite })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Mony Deposite'))
  }
}
