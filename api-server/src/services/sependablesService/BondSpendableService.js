import MoniesModel from '../../models/safesModels/MoniesModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import BondSpendableModel from '../../models/spendablesModels/BondSpendableModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateBondSpendable(req, res, next) {
  const {
    safe,
    spendableTo,
    spendableResponsible,
    mony,
    date,
    notes,
  } = req.body

  try {
    const check = await checkSafeMony(safe, mony)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }

    const newBondSpendable = await BondSpendableModel.create({
      safe,
      spendableTo,
      spendableResponsible,
      mony,
      date,
      notes,
    })

    const newPulledMony = await MonyPulledModel.create({
      safe,
      mony,
      date,
      name: spendableResponsible,
      typePulled: 'bond spendable',
      notes,
    })
    await MoniesModel.updateOne(
      { safe },
      {
        $inc: { mony: -parseInt(mony) },
      },
    )

    const savedPulledMony = await newPulledMony.save()
    const savedBondSpendable = await newBondSpendable.save()
    const exist = await SafeModel.findById(safe)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Bond Spendable ($${mony}) from safe (${exist?.title}) to name (${spendableTo}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      data: savedBondSpendable,
      savedPulledMony,
    })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Bond Spendable'))
  }
}

export async function getBondSpendableById(req, res, next) {
  const { id } = req.params
  try {
    const bondSpendablee = await BondSpendableModel.findById(id)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    if (!bondSpendablee) {
      return next(new ApiErr(FAIL, 403, `Bond Spendable Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: bondSpendablee })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Bond Spendable'))
  }
}

export async function deletedBondSpendableById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await BondSpendableModel.findById(id)
    await BondSpendableModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Bond Spendable of name (${exist?.spendableTo}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Bond Spendable has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Bond Spendable'))
  }
}

export async function getAllBondsSpendables(req, res, next) {
  try {
    const bondsSpendables = await BondSpendableModel.find()
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: bondsSpendables })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Bonds Spendables'))
  }
}

/*FUNCTION*/

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
