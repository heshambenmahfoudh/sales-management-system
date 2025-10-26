import MonyDepositeModel from '../../models/safesModels/MonyDepositeModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import BondReceivableModel from '../../models/spendablesModels/BondReceivableModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateBondReceivable(req, res, next) {
  const {
    safe,
    rceivableFrom,
    receivableResponsible,
    mony,
    date,
    notes,
  } = req.body
  try {
    const existingSafe = await MoniesModel.findOne({ safe })
    const newBondReceivable = await BondReceivableModel.create({
      safe,
      rceivableFrom,
      receivableResponsible,
      mony,
      date,
      notes,
    })
    if (existingSafe === null) {
      await MoniesModel.create({ safe, mony })
    } else {
      await MoniesModel.updateOne(
        { safe },
        {
          $inc: { mony: parseInt(mony) },
        },
      )
    }

    const newDepositeMony = await MonyDepositeModel.create({
      safe,
      mony,
      date,
      name: receivableResponsible,
      typeDeposite: 'bond receivable',
      notes,
    })
    const savedDepositeMony = await newDepositeMony.save()
    const savedBondReceivable = await newBondReceivable.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Bond Recievable (${mony}) from (${rceivableFrom}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      data: savedBondReceivable,
      savedDepositeMony,
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Bond Receivable'))
  }
}

export async function getBondReceivableById(req, res, next) {
  const { id } = req.params
  try {
    const bondReceivable = await BondReceivableModel.findById(id)
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })
    if (!bondReceivable) {
      return next(new ApiErr(FAIL, 403, `Bond Receivable Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: bondReceivable })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Bond Receivable'))
  }
}

export async function deletedBondReceivableById(req, res, next) {
  const { id } = req.params
  try {
    await BondReceivableModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Bond Recievable Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Bond Receivable has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Bond Receivable'))
  }
}

export async function getAllBondsReceivables(req, res, next) {
 
  
  try {
    const bondsReceivables = await BondReceivableModel.find()
      .populate({ path: 'safe', select: 'title' })
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: bondsReceivables })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Bonds Receivables'))
  }
}
