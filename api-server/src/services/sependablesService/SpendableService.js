import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import SpendableModel from '../../models/spendablesModels/SpendableModel.js'
import TypeSpendableModel from '../../models/spendablesModels/TypeSpendableModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateSpendable(req, res, next) {
  const { typespendable, safe, name, mony, date, notes } = req.body

  try {
    const check = await checkSafeMony(safe, mony)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }
    const newSpendable = await SpendableModel.create({
      typespendable,
      name: name,
      mony: parseInt(mony),
      safe,
      date,
      notes,
    })
    const newPulledMony = await MonyPulledModel.create({
      safe,
      mony: parseInt(mony),
      date,
      name: name,
      typePulled: 'Spendables',
      notes,
    })
    await MoniesModel.updateOne(
      { safe },
      {
        $inc: { mony: -parseInt(mony) },
      },
    )

    const savedPulledMony = await newPulledMony.save()
    const savedSpendable = await newSpendable.save()
    const exist = await TypeSpendableModel.findById(typespendable)
    const existSafe = await SafeModel.findById(safe)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Spendable (${exist?.title}) ($${mony}) from safe (${existSafe?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res
      .status(200)
      .json({ status: SUCCESS, data: savedSpendable, savedPulledMony })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Spendable'))
  }
}

export async function getSpendableById(req, res, next) {
  const { id } = req.params
  try {
    const spendable = await SpendableModel.findById(id).populate([
      {
        path: 'typespendable',
        select: 'title',
      },
      {
        path: 'safe',
        select: 'title',
      },
    ])
    if (!spendable) {
      return next(new ApiErr(FAIL, 403, ` Spendable Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: spendable })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Spendable'))
  }
}

export async function deletedSpendableById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await SpendableModel.findById(id)
    const existTypeSpendable = await TypeSpendableModel.findById(
      exist?.typespendable,
    )
    await SpendableModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Spendable (${existTypeSpendable?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Spendable has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Spendable'))
  }
}

export async function getAllSpendables(req, res, next) {
  try {
    const spendables = await SpendableModel.find()
      .sort({
        createdAt: -1,
      })
      .populate([
        {
          path: 'typespendable',
          select: 'title',
        },
        {
          path: 'safe',
          select: 'title',
        },
      ])
    res.status(200).json({ status: SUCCESS, data: spendables })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Spendables'))
  }
}

/*FUNCTIONS*/

async function checkSafeMony(safe, mony) {
  const existingSafe = await SafeModel.findById(safe)
  const existingMony = await MoniesModel.findOne({ safe })
  const safeName = existingSafe?.title
  const safeMony = existingMony?.mony

  if (!safeName) {
    return {
      valid: false,
      message: `This Safe (${existingSafe?.title}) Not Found`,
    }
  }
  if (!existingMony) {
    return {
      valid: false,
      message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
    }
  }
  if (safeMony < parseInt(mony)) {
    return {
      valid: false,
      message: `The Mony Pulled (${mony}) More Mony in The Safe (${existingSafe?.title}) `,
    }
  }
}
