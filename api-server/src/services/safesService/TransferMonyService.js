import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyDepositeModel from '../../models/safesModels/MonyDepositeModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import TransferMonyModel from '../../models/safesModels/TransferMonyModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateTransferMony(req, res, next) {
  const { from_safe, to_safe, mony, date, name, notes } = req.body

  try {
    const check = await checkExixtingSafeMony(from_safe, to_safe, mony)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 402, check?.message))
    }
    const existingSafeTo = await MoniesModel.findOne({ safe: to_safe })
    const newTransferMony = await TransferMonyModel.create({
      from_safe,
      to_safe,
      mony,
      date,
      name,
      notes,
    })

    await MoniesModel.updateOne(
      { safe: from_safe },
      {
        $inc: { mony: -parseInt(mony) },
      },
    )
    if (existingSafeTo === null) {
      await MoniesModel.create({ safe: to_safe, mony })
    } else {
      await MoniesModel.updateOne(
        { safe: to_safe },
        {
          $inc: { mony: parseInt(mony) },
        },
      )
    }

    const newPulledMony = await MonyPulledModel.create({
      safe: from_safe,
      mony,
      date,
      typePulled: 'transfer mony',
      name,
      notes: notes,
    })
    const newDepositeMony = await MonyDepositeModel.create({
      safe: to_safe,
      mony,
      date,
      typeDeposite: 'transfer mony',
      name,
      notes: notes,
    })
    const savedTransferMony = await newTransferMony.save()
    const savedDepositeMony = await newDepositeMony.save()
    const savedPulledMony = await newPulledMony.save()
    const session = await getUserSession(req, res, next)
    const existFrom = await SafeModel.findById(from_safe)
    const existTo = await SafeModel.findById(to_safe)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Transfer mony ($${mony}) from safe (${existFrom?.title}) to safe (${existTo?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      data: savedTransferMony,
      savedDepositeMony,
      savedPulledMony,
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Transfer Mony'))
  }
}

export async function getTransferMonyById(req, res, next) {
  const { id } = req.params
  try {
    const transferMony = await TransferMonyModel.findById(id).populate([
      {
        path: 'from_safe',
        select: 'title',
      },
      {
        path: 'to_safe',
        select: 'title',
      },
    ])
    if (!transferMony) {
      return next(new ApiErr(FAIL, 403, ` Transfer Mony Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: transferMony })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Transfer Mony'))
  }
}

export async function deletedTransferMonyById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await TransferMonyModel.findById(id)
    await TransferMonyModel.findByIdAndDelete(id)
    const existFrom = await SafeModel.findById(exist?.from_safe)
    const existTo = await SafeModel.findById(exist?.to_safe)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Transfer mony ($${exist?.mony}) from safe (${existFrom?.title}) to safe (${existTo?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Transfer Mony has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Transfer Mony'))
  }
}

export async function getAllTransfersMony(req, res, next) {
  const { fromDate, toDate, name } = req.query
  let searchByDateAndName = {}
  if (fromDate && toDate) {
    searchByDateAndName.date = {
      $gte: fromDate,
      $lte: toDate,
    }
  }
  if (name) {
    searchByDateAndName.name = {
      $regex: name,
    }
  }
  try {
    const transfersMony = await TransferMonyModel.find(searchByDateAndName)
      .populate([
        {
          path: 'from_safe',
          select: 'title',
        },
        {
          path: 'to_safe',
          select: 'title',
        },
      ])
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: transfersMony })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching transfers Mony'))
  }
}

/*FUNCTIONS*/

async function checkExixtingSafeMony(from_safe, to_safe, mony) {
  try {
    const existingSafe = await MoniesModel.findOne({ safe: from_safe })
    const safeName = await SafeModel.findById(from_safe)
    const safeMony = existingSafe?.mony
    if (from_safe === to_safe) {
      return {
        valid: false,
        message: 'Can`t Transfer to the Same Safe',
      }
    }
    if (parseInt(mony) > safeMony) {
      return {
        valid: false,
        message: `The Mony in Safe  Less of (${mony})`,
      }
    }
    if (safeMony === undefined) {
      return {
        valid: false,
        message: `The Safe (${safeName?.title}) is Empty`,
      }
    }
  } catch (error) {}
}
