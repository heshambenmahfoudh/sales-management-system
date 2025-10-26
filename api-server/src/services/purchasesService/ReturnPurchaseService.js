import mongoose from 'mongoose'
import ReturnPurchaseModel from '../../models/purchasesModels/ReturnPurchaseModel.js'
import PurchaseModel from '../../models/purchasesModels/PurchaseModel.js'
import ProductQtyModel from '../../models/inventoryModels/ProductQtyModel.js'
import MonyDepositeModel from '../../models/safesModels/MonyDepositeModel.js'
import SupplierMonyModel from '../../models/suppliersModels/SupplierMonyModel.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import ApiErr from '../../utils/apiErr.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'
import SupplierModel from '../../models/suppliersModels/SupplierModel.js'

export async function CreateReturnPurchase(req, res, next) {
  const {
    purchases,
    totalItemsPrice,
    warehouse,
    pay,
    notes,
    date,
    resposibleName,
    status,
    balance,
  } = req.body

  const session = await mongoose.startSession()
  try {
    await session.startTransaction()

    if (status?.includes('RETURN ALL ORDER')) {
      await returnAllOrder(
        purchases,
        warehouse,
        date,
        totalItemsPrice,
        resposibleName,
        notes,
        req,
        res,
        next,
      )
    } else {
      await returnPartOrder(
        purchases,
        warehouse,
        date,
        totalItemsPrice,
        pay,
        balance,
        resposibleName,
        notes,
        req,
        res,
        next,
      )
    }

    res.status(200).json({ status: SUCCESS, message: 'Created Sussessfully' })
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Return Purchase'))
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
}

export async function getReturnPurchaseById(req, res, next) {
  const { id: returnId } = req.params
  
  try {
    const returnPurchase = await ReturnPurchaseModel.find({
      returnId,
    }).populate([
      {
        path: 'supplier',
        select: 'name',
      },
      {
        path: 'product',
      },
      {
        path: 'unit',
        select: 'title',
      },
      {
        path: 'warehouse',
        select: 'title',
      },
    ])
    if (!returnPurchase) {
      return next(new ApiErr(FAIL, 403, `Purchase Return Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: returnPurchase })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Purchase Return'))
  }
}

export async function deletedReturnPurchaseById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await ReturnPurchaseModel.findById(id)
    await ReturnPurchaseModel.deleteMany({ returnId: exist?.returnId })
    const session = await getUserSession(req, res, next)
    const existingSupplier = await SupplierModel.findById(exist?.supplier)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Purchase Return Order (${exist?.order}) of supplier (${existingSupplier?.name}) Successfully`,
    }

    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Return Purchase has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Return Purchase'))
  }
}

export async function getAllReturnsPurchases(req, res, next) {
  try {
    const purchasesReturns = await ReturnPurchaseModel.find()
      .populate([
        {
          path: 'supplier',
          select: 'name',
        },
        {
          path: 'product',
        },
        {
          path: 'unit',
          select: 'title',
        },
        {
          path: 'warehouse',
          select: 'title',
        },
      ])
      .sort({ createdAt: -1 })
    res.status(200).json({ status: SUCCESS, data: purchasesReturns })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Purchases Returns'))
  }
}

/*FUNCTIONS*/

async function returnAllOrder(
  purchases,
  warehouse,
  date,
  totalItemsPrice,
  resposibleName,
  notes,
  req,
  res,
  next,
) {
  try {
    const existingPurchase = await PurchaseModel.findOne({
      order: purchases?.[0]?.order,
    })

    let pay = existingPurchase?.pay
    let balance = existingPurchase?.balance
    const returnId = await generateOrderId()
    for (const pur of purchases) {
      await ReturnPurchaseModel.create({
        returnId,
        order: pur?.order,
        supplier: pur?.supplier,
        product: pur?.product,
        sku: pur?.sku,
        unit: pur?.unit,
        qty: pur?.qty,
        price: pur?.price,
        totalPrice: pur?.totalPrice,
        warehouse,
        date,
        totalItemsPrice: parseInt(totalItemsPrice),
        pay: 0,
        balance: 0,
        resposibleName,
        notes,
      })

      await PurchaseModel.deleteOne({
        order: pur?.order,
        supplier: pur?.supplier,
        sku: pur?.sku,
        price: parseInt(pur?.price),
        totalPrice: parseInt(pur?.totalPrice),
        totalItemsPrice: parseInt(totalItemsPrice),
        pay: parseInt(pay),
        qty: parseInt(pur?.qty),
        balance: parseInt(balance),
      })
      await updateQtyInWareHouse(
        pur?.sku,
        pur?.product,
        pur?.qty,
        pur?.price,
        warehouse,
        date,
        notes,
        next,
      )
    }

    await SupplierMonyModel.deleteOne({
      order: purchases?.[0]?.order,
      supplier: purchases?.[0]?.supplier,
      totalItemsPrice: parseInt(totalItemsPrice),
      pay: parseInt(pay),
      balance: parseInt(balance),
    })
    await editeMonySafe(pay, date, notes, resposibleName)
    const session = await getUserSession(req, res, next)
    const existingSupplier = await SupplierModel.findById(
      purchases?.[0]?.supplier,
    )
    const userLog_1 = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Purchase Return all Order (${purchases?.[0]?.order}) of supplier (${existingSupplier?.name}) Successfully`,
    }
    const userLog_2 = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Supplier Mony of Purchase Order (${purchases?.[0]?.order}) of supplier (${existingSupplier?.name}) Successfully`,
    }
    await createNewUserLog(userLog_1, req, res, next)
    await createNewUserLog(userLog_2, req, res, next)
  } catch (error) {
    console.log(error)
  }
}

async function returnPartOrder(
  purchases,
  warehouse,
  date,
  totalItemsPrice,
  resposibleName,
  notes,
  req,
  res,
  next,
) {
  try {
    let newPay = 0,
      newTotalItemsPrice = 0,
      newbalance = 0,
      newMony = 0

    const existingPurchase = await PurchaseModel.findOne({
      order: purchases?.[0]?.order,
    })
    newTotalItemsPrice = Math.abs(
      parseInt(existingPurchase?.totalItemsPrice) - parseInt(totalItemsPrice),
    )
    let pay = existingPurchase?.pay

    if (pay > newTotalItemsPrice) {
      newbalance = 0
      newMony = parseInt(pay) - parseInt(newTotalItemsPrice)
      newPay = parseInt(newTotalItemsPrice)
    } else if (pay < newTotalItemsPrice) {
      newbalance = parseInt(newTotalItemsPrice) - parseInt(pay)
      newPay = parseInt(pay)
      newMony = 0
    } else {
      newbalance = 0
      newPay = parseInt(pay)
      newMony = 0
    }
    const returnId = await generateOrderId()
    for (const pur of purchases) {
      await ReturnPurchaseModel.create({
        returnId,
        order: pur?.order,
        supplier: pur?.supplier,
        product: pur?.product,
        sku: pur?.sku,
        unit: pur?.unit,
        qty: pur?.qty,
        price: pur?.price,
        totalPrice: pur?.totalPrice,
        warehouse,
        date,
        totalItemsPrice: parseInt(totalItemsPrice),
        pay: parseInt(0),
        balance: parseInt(0),
        resposibleName,
        notes,
      })

      await PurchaseModel.deleteOne({
        order: pur?.order,
        supplier: pur?.supplier,
        product: pur?.product,
        sku: pur?.sku,
        date: existingPurchase?.date,
      })
      await PurchaseModel.updateOne(
        {
          order: pur?.order,
          supplier: pur?.supplier,
          date: existingPurchase?.date,
        },
        {
          $set: {
            pay: parseInt(newPay),
            balance: parseInt(newbalance),
            totalItemsPrice: parseInt(newTotalItemsPrice),
          },
        },
      )
      await SupplierMonyModel.updateOne(
        {
          order: pur?.order,
          supplier: pur?.supplier,
          date: existingPurchase?.date,
        },
        {
          $set: {
            pay: parseInt(newPay),
            balance: parseInt(newbalance),
            totalItemsPrice: parseInt(newTotalItemsPrice),
          },
        },
      )
      await updateQtyInWareHouse(
        pur?.sku,
        pur?.product,
        pur?.qty,
        pur?.price,
        warehouse,
        date,
        notes,
        next,
      )
    }
    await editeMonySafe(newMony, date, notes, resposibleName)
    const session = await getUserSession(req, res, next)
    const existingSupplier = await SupplierModel.findById(
      purchases?.[0]?.supplier,
    )
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Purchase Return part Order (${purchases?.[0]?.order}) of supplier ($${existingSupplier?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
  } catch (error) {}
}

async function updateQtyInWareHouse(
  sku,
  product,
  qty,
  price,
  warehouse,
  date,
  notes,
  next,
) {
  const existProductQty = await ProductQtyModel.findOne({
    sku,
    product,
    buyPrice: parseInt(price),
    warehouse,
  })
  const existProduct = await ProductModel.findOne({
    sku,
    product,
  })
  //  status one
  if (existProductQty) {
    await ProductQtyModel.updateOne(
      {
        sku,
        product,
        warehouse,
        buyPrice: parseInt(price),
      },
      { $inc: { qty: parseInt(qty) } },
    )
  } else {
    await ProductQtyModel.create({
      sku,
      product,
      warehouse,
      qty: parseInt(qty),
      buyPrice: parseInt(existProduct?.buyPrice),
      salePrice: parseInt(existProduct?.salePrice),
      date,
      notes,
    })
  }
}

async function editeMonySafe(mony, date, notes, name) {
  let safeId = '1'

  try {
    const newDepositeMony = await MonyDepositeModel.create({
      safe: safeId,
      mony: mony,
      date,
      name,
      typeDeposite: 'Return Purchase Order',
      notes,
    })

    await MoniesModel.updateOne(
      { safe: safeId },
      {
        $inc: { mony: parseInt(mony) },
      },
    )

    await newDepositeMony.save()
  } catch (err) {}
}

async function generateOrderId() {
  try {
    let order =1
    const lastNumber = await ReturnPurchaseModel.findOne().sort({
      _id: -1,
    })
    order = lastNumber ? parseInt(lastNumber.returnId) + 1 : 1
    return order
  } catch (error) {}
}
