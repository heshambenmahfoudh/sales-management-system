import CustomerModel from '../../models/customersModels/CustomerModel.js'
import CustomerMonyModel from '../../models/customersModels/CustomerMonyModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyDepositeModel from '../../models/safesModels/MonyDepositeModel.js'
import SaleModel from '../../models/salesModels/SaleModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function deletedCustomerMonyById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await CustomerMonyModel.findById(id)
    const existCus = await CustomerModel.findById(exist?.customer)
    await CustomerMonyModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Customer Mony of order (${exist?.order}) of customer (${existCus?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res
      .status(200)
      .json({ status: SUCCESS, message: 'Customer Mony has been Deleted' })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Delete Customers Mony'))
  }
}

export async function updatedCustomerMonyById(req, res, next) {
  const { id } = req.params
  const { pay, balance, date: datePay, order, user } = req.body

  try {
    const updatedCustomerMony = await CustomerMonyModel.findByIdAndUpdate(
      id,
      {
        $inc: { pay: parseInt(pay) },
        $set: { balance: parseInt(balance), datePay: datePay },
      },
      { new: true },
    )

    await SaleModel.updateMany(
      { order },
      {
        $inc: { pay: parseInt(pay) },
        $set: { balance: parseInt(balance) },
      },
    )
    await depositeMonySafe(pay, datePay, user)
    const exist = await CustomerMonyModel.findById(id)
    const existCus = await CustomerModel.findById(exist?.customer)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Customer Mony of order (${order}) pay ($${pay}) from customer (${existCus?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)

    res.status(200).json({ status: SUCCESS, data: updatedCustomerMony })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Customer Mony'))
  }
}

export async function getCustomerMonyById(req, res, next) {
  const { id } = req.params
  try {
    const customerPaid = await CustomerMonyModel.findById(id).populate({
      path: 'customer',
      select: 'name',
    })
    if (!customerPaid) {
      return next(new ApiErr(FAIL, 403, ` Customer Paid Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: customerPaid })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Customer Paid'))
  }
}

export async function getAllCustomersMony(req, res, next) {
  const { balance } = req.query
  let filterAndSearch = {}

  if (balance) {
    filterAndSearch.balance = { $gt: 1 }
  } else {
    filterAndSearch.balance = { $lte: 0 }
  }
  try {
    const customersMony = await CustomerMonyModel.find(filterAndSearch)
      .populate([{ path: 'customer', select: 'name email phone' }])
      .sort({
        createdAt: -1,
      })

    res.status(200).json({ status: SUCCESS, data: customersMony })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Customers Mony'))
  }
}

// FUNCTIONS
async function depositeMonySafe(mony, date, name) {
  let safeId = '1'
  try {
    await MonyDepositeModel.create({
      safe: safeId,
      mony,
      date,
      name,
      typeDeposite: 'Pay Mony Sale Order',
      notes: 'Pay Mony Sale Order',
    })

    await MoniesModel.updateOne(
      { safe: safeId },
      {
        $inc: { mony: parseInt(mony) },
      },
    )
  } catch (err) {}
}
