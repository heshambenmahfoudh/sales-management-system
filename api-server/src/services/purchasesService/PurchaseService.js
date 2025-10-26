import mongoose from 'mongoose'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import PurchaseModel from '../../models/purchasesModels/PurchaseModel.js'
import SupplierMonyModel from '../../models/suppliersModels/SupplierMonyModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'
import SupplierModel from '../../models/suppliersModels/SupplierModel.js'

export async function CreatePurchase(req, res, next) {
  const {
    supplier,
    products,
    date,
    totalItemsPrice,
    pay,
    balance,
    notes,
    dateMaturity,
    resposibleName,
  } = req.body

  const session = await mongoose.startSession()
  try {
    const checkMony = await CheckMonySafeExist(pay)
    if (checkMony?.valid === false) {
      return next(new ApiErr(FAIL, 402, checkMony?.message))
    }
    await session.startTransaction()
    const order = await generateOrderId('purchase')
   
    for (const product of products) {
      await PurchaseModel.create({
        order,
        supplier,
        product: product?._id,
        sku: product?.sku,
        unit: product?.unit,
        qty: parseInt(product?.qty),
        price: parseInt(product?.price),
        totalPrice: parseInt(product?.totalPrice),
        date,
        totalItemsPrice: parseInt(totalItemsPrice),
        pay: parseInt(pay),
        balance: parseInt(balance),
        resposibleName,
        notes,
      })
    }
    const supplierMonyId = await generateOrderId()

    if (balance > 0) {
      await SupplierMonyModel.create({
        supplierMonyId,
        order,
        supplier,
        totalItemsPrice,
        pay: parseInt(pay),
        balance: parseInt(balance),
        dateMaturity,
        date,
      })
    } else {
      await SupplierMonyModel.create({
        supplierMonyId,
        order,
        supplier,
        totalItemsPrice,
        pay: parseInt(pay),
        balance: parseInt(balance),
        date,
      })
    }

    await MoniesModel.updateOne(
      { safe: '1' },
      {
        $inc: { mony: -parseInt(pay) },
      },
    )
    await MonyPulledModel.create({
      safe: '1',
      mony: pay,
      date,
      name: resposibleName,
      typePulled: 'Purchase Order',
      notes,
    })
    const userSession = await getUserSession(req, res, next)
    const existing = await SupplierModel.findById(supplier)
    const existingSafe = await SafeModel.findById('1')

    const userLog_1 = {
      user: userSession?._id,
      activity: `User (${userSession?.name}) Created New Purchase order (${order}) from supplier (${existing?.name}) Successfully`,
    }
    const userLog_2 = {
      user: userSession?._id,
      activity: `User (${userSession?.name}) Pay ($${pay}) of Purchase Order (${order}) from Safe (${existingSafe?.title}) Successfully`,
    }
    const userLog_3 = {
      user: userSession?._id,
      activity: `User (${userSession?.name}) Created New Supplier Mony of Purchase Order (${order}) pay ($${pay}) balance ($${balance}) of supplier ($${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog_3, req, res, next)
    await createNewUserLog(userLog_2, req, res, next)
    await createNewUserLog(userLog_1, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'success',
    })
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Purchase'))
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
}

export async function getPurchaseById(req, res, next) {
  const { id: order } = req.params
  const { stored } = req.query
  const filterdData = {}
  if (stored) {
    filterdData.isStored = stored
  }

  try {
    const purchase = await PurchaseModel.find({
      order,
      ...filterdData,
    }).populate([
      { path: 'supplier', select: 'name' },
      { path: 'product' },
      { path: 'unit', select: 'title' },
    ])

    if (!order || purchase?.length < 1) {
      return next(new ApiErr(FAIL, 403, ` Purchase Order Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: purchase })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Purchase'))
  }
}

export async function deletedPurchaseById(req, res, next) {
  const { id } = req.params
  try {
    const existing = await PurchaseModel.findById(id)
    await PurchaseModel.deleteMany({ order: existing.order })
    const session = await getUserSession(req, res, next)
    const existingSupplier = await SupplierModel.findById(existing?.supplier)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Purchase Order (${existing?.order}) of supplier (${existingSupplier?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'success',
    })
    res.status(200).json({
      status: SUCCESS,
      message: 'Purchase has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Purchase'))
  }
}

export async function getAllPurchases(req, res, next) {
  const { order } = req.query
  let SearchData = {}

  if (order) {
    SearchData.order = order
  }
  parseInt(order)
  if (order === false || order === '' || order === 'undefined') {
    return next(new ApiErr(FAIL, 402, 'Please Write The Order Number'))
  }
  try {
    const purchases = await PurchaseModel.find(SearchData)
      .populate([
        { path: 'supplier', select: 'name' },
        { path: 'product' },
        { path: 'unit', select: 'title' },
      ])
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: purchases })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Purchases'))
  }
}

/*FUNCTIONS*/
async function CheckMonySafeExist(mony) {
  let safeId = '1'
  const existingSafe = await SafeModel.findById(safeId)
  const existingSafeMony = await MoniesModel.findOne({ safe: safeId })
  if (!existingSafe) {
    return {
      valid: false,
      message: `The Safe Not Found`,
    }
  }
  if (existingSafeMony <= 0) {
    return {
      valid: false,
      message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
    }
  }
  if (existingSafeMony?.mony < mony) {
    return {
      valid: false,
      message: `The Mony (${mony}) Require More Mony in The Safe (${existingSafe?.title}) `,
    }
  }
}

async function generateOrderId(status) {
  try {
    let order = 1
    if (status === 'purchase') {
      const lastOrder = await PurchaseModel.findOne({}).sort({ _id: -1 })
      let newOrder = 1
      if (lastOrder && lastOrder.order) {
        const lastId = lastOrder.order.split('-')[1]
        newOrder = parseInt(lastId, 10) + 1
      }
      const addedNum = String(newOrder).padStart(3, '0')
      order = `ORD-${addedNum}`
    } else {
      const lastNumber = await SupplierMonyModel.findOne().sort({
        supplierMonyId: -1,
      })
      order = lastNumber ? parseInt(lastNumber.supplierMonyId) + 1 : 1
    }

    return order
  } catch (error) {}
}
