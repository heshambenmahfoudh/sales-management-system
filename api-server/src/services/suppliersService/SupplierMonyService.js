import PurchaseModel from '../../models/purchasesModels/PurchaseModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import SupplierModel from '../../models/suppliersModels/SupplierModel.js'
import SupplierMonyModel from '../../models/suppliersModels/SupplierMonyModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function deletedSuppliersMonyById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await SupplierMonyModel.findById(id)
    const existSup = await SupplierModel.findById(exist?.supplier)
    await SupplierMonyModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Supplier Mony of order (${exist?.order}) of supplier (${existSup?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)

    res
      .status(200)
      .json({ status: SUCCESS, message: 'Supplier Mony has been Deleted' })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Delete Suppliers Mony'))
  }
}

export async function updatedSuppliersMonyById(req, res, next) {
  const { id } = req.params
  const { pay, balance, date: datePay, name, order } = req.body

  try {
    const checkMony = await CheckMonySafeExist(pay)
    if (checkMony?.valid === false) {
      return next(new ApiErr(FAIL, 402, checkMony?.message))
    }

    const updatedSupplierMony = await SupplierMonyModel.findByIdAndUpdate(
      id,
      {
        $inc: { pay: parseInt(pay) },
        $set: { balance: parseInt(balance), datePay: datePay },
      },
      { new: true },
    )

    await PurchaseModel.updateMany(
      { order },
      {
        $inc: { pay: parseInt(pay) },
        $set: { balance: parseInt(balance) },
      },
    )

    await pulledSafeMony(pay, datePay, name)
    const exist = await SupplierMonyModel.findById(id)
    const existSupp = await SupplierModel.findById(exist?.supplier)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Supplier Mony of order (${order}) pay ($${pay}) to supplier (${existSupp?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)

    res.status(200).json({ status: SUCCESS, data: updatedSupplierMony })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Updated Supplier Mony'))
  }
}

export async function getSupplierMonyById(req, res, next) {
  const { id } = req.params
  try {
    const supplierMony = await SupplierMonyModel.findById(id).populate([
      { path: 'supplier', select: 'name email phone' },
    ])

    if (!supplierMony) {
      return next(new ApiErr(FAIL, 403, 'Suppliers Mony Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: supplierMony })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Supplier Mony'))
  }
}

export async function getAllSuppliersMony(req, res, next) {
  const { balance } = req.query
  let filterAndSearchByDate = {}

  if (balance) {
    filterAndSearchByDate.balance = { $gt: 1 }
  } else {
    filterAndSearchByDate.balance = { $lte: 0 }
  }
  try {
    const suppliersMony = await SupplierMonyModel.find(filterAndSearchByDate)
      .populate([{ path: 'supplier', select: 'name email phone' }])
      .sort({
        createdAt: -1,
      })

    res.status(200).json({ status: SUCCESS, data: suppliersMony })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Suppliers Mony'))
  }
}

/*FUNCTIONS*/
async function CheckMonySafeExist(mony) {
  let safeId = '1'
  const existingSafe = await SafeModel.findById(safeId)
  const existingMony = await MoniesModel.findOne({ safeId })
  const safeMony = existingMony?.mony

  if (!existingMony) {
    return {
      valid: false,
      message: `This Safe is Not Found`,
    }
  }
  if (safeMony <= 0) {
    return {
      valid: false,
      message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
    }
  }
  if (parseInt(safeMony) < parseInt(mony)) {
    return {
      valid: false,
      message: `The Mony (${mony}) Required More of Mony in The Safe (${existingSafe?.title}) `,
    }
  }
}

async function pulledSafeMony(pay, date, name) {
  await MonyPulledModel.create({
    safe: '1',
    mony: parseInt(pay),
    date,
    name,
    typePulled: 'Pay Mony Purchase Order',
    notes: 'Pay Mony Purchase Order',
  })
  await MoniesModel.updateOne(
    { safe: '1' },
    {
      $inc: { mony: -parseInt(pay) },
    },
  )
}
