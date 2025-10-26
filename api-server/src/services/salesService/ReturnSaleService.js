import mongoose from 'mongoose'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import ApiErr from '../../utils/apiErr.js'
import ProductQtyModel from '../../models/inventoryModels/ProductQtyModel.js'
import SaleModel from '../../models/salesModels/SaleModel.js'
import ReturnSaleModel from '../../models/salesModels/ReturnSaleModel.js'
import CustomerMonyModel from '../../models/customersModels/CustomerMonyModel.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import { createNewUserLog } from '../usersService/UserLogService.js'
import { getUserSession } from '../usersService/AuthService.js'
import CustomerModel from '../../models/customersModels/CustomerModel.js'

export async function CreateReturnSale(req, res, next) {
  const {
    sales,
    totalItemsPrice,
    warehouse,
    notes,
    date,
    status,
    resposibleName,
  } = req.body

  const session = await mongoose.startSession()
  try {
    await session.startTransaction()

    if (status?.includes('RETURN ALL ORDER')) {
      await returnAllOrder(
        sales,
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
        sales,
        warehouse,
        date,
        totalItemsPrice,
        resposibleName,
        notes,
        req,
        res,
        next,
      )
    }

    res
      .status(200)
      .json({ status: SUCCESS, message: 'sale order created succesfully' })
    await session.commitTransaction()
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Return Sale'))
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
}

export async function getReturnSaleById(req, res, next) {
  const { id: returnId } = req.params
  try {
    const returnSale = await ReturnSaleModel.find({
      returnId,
    }).populate([
      {
        path: 'customer',
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
    if (!returnSale) {
      return next(new ApiErr(FAIL, 403, ` Return Sale Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: returnSale })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Return Sale'))
  }
}

export async function deletedReturnSaleById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await ReturnSaleModel.findById(id)
    const existingCus = await CustomerModel.findById(exist?.customer)
    await ReturnSaleModel.deleteMany({ returnId: exist?.returnId })
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Sale Return Order (${
        exist?.order
      }) of customer (${
        existingCus ? existingCus?.name : exist?.cashCustomer
      }) Successfully`,
    }

    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Sale Return has been Deleted',
    })
    res.status(200).json({
      status: SUCCESS,
      message: 'Sale Return has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Return Sale'))
  }
}

export async function getAllReturnsales(req, res, next) {
  try {
    const salesReturns = await ReturnSaleModel.find()
      .populate([
        {
          path: 'customer',
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
    res.status(200).json({ status: SUCCESS, data: salesReturns })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Sales Returns'))
  }
}

/*FUNCTONS*/
async function returnAllOrder(
  sales,
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
    const existingSale = await SaleModel.findOne({
      order: sales?.[0]?.order,
    })

    let pay = existingSale?.pay
    let balance = existingSale?.balance
    const returnId = await generateOrderId()
    for (const sale of sales) {
      await ReturnSaleModel.create({
        returnId,
        order: sale?.order,
        customer: sale?.customer,
        cashCustomer: sale?.cashCustomer,
        product: sale?.product,
        sku: sale?.sku,
        unit: sale?.unit,
        qty: parseInt(sale?.qty),
        price: parseInt(sale?.price),
        totalPrice: parseInt(sale?.totalPrice),
        warehouse,
        date,
        totalItemsPrice: parseInt(totalItemsPrice),
        pay: 0,
        balance: 0,
        resposibleName,
        notes,
      })

      await SaleModel.deleteOne({
        order: sale?.order,
        sku: sale?.sku,
        price: parseInt(sale?.price),
        totalPrice: parseInt(sale?.totalPrice),
        totalItemsPrice: parseInt(totalItemsPrice),
        qty: parseInt(sale?.qty),
        pay: parseInt(pay),
        balance: parseInt(balance),
      })

      await updateQtyInWareHouse(
        sale?.sku,
        sale?.product,
        sale?.qty,
        sale?.price,
        warehouse,
        date,
        notes,
        next,
      )
    }

    await CustomerMonyModel.deleteOne({
      order: sales?.[0]?.order,
      customer: sales?.[0]?.customer,
      totalItemsPrice: parseInt(totalItemsPrice),
      pay: parseInt(pay),
      balance: parseInt(balance),
    })

    await editeSafeMony(pay, date, notes, resposibleName)
    const session = await getUserSession(req, res, next)
    const existingCus = await CustomerModel.findById(sales?.[0]?.customer)
    const userLog_1 = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Sale Return all Order (${
        sales?.[0]?.order
      }) of customer (${
        existingCus ? existingCus?.name : existingSale?.cashCustomer
      }) Successfully`,
    }
    const userLog_2 = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Customer Mony of Sale Order (${
        sales?.[0]?.order
      }) of customer (${
        existingCus ? existingCus?.name : existingSale?.cashCustomer
      }) Successfully`,
    }
    await createNewUserLog(userLog_1, req, res, next)
    await createNewUserLog(userLog_2, req, res, next)
  } catch (error) {
    console.log(error)
  }
}

async function returnPartOrder(
  sales,
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

    const existingSale = await SaleModel.findOne({
      order: sales?.[0]?.order,
    })
    newTotalItemsPrice = Math.abs(
      parseInt(existingSale?.totalItemsPrice) - parseInt(totalItemsPrice),
    )
    let pay = existingSale?.pay

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
    for (const sale of sales) {
      await ReturnSaleModel.create({
        returnId,
        order: sale?.order,
        customer: sale?.customer,
        product: sale?.product,
        sku: sale?.sku,
        unit: sale?.unit,
        qty: parseInt(sale?.qty),
        price: parseInt(sale?.price),
        totalPrice: parseInt(sale?.totalPrice),
        warehouse,
        date,
        totalItemsPrice: parseInt(totalItemsPrice),
        pay: parseInt(0),
        balance: parseInt(0),
        resposibleName,
        notes,
      })

      await SaleModel.deleteOne({
        order: sale?.order,
        customer: sale?.customer,
        product: sale?.product,
        sku: sale?.sku,
        date: existingSale?.date,
      })
      await SaleModel.updateOne(
        {
          order: sale?.order,
          customer: sale?.customer,
          date: existingSale?.date,
        },
        {
          $set: {
            pay: parseInt(newPay),
            balance: parseInt(newbalance),
            totalItemsPrice: parseInt(newTotalItemsPrice),
          },
        },
      )
      await CustomerMonyModel.updateOne(
        {
          order: sale?.order,
          customer: sale?.customer,
          date: existingSale?.date,
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
        sale?.sku,
        sale?.product,
        sale?.qty,
        sale?.price,
        warehouse,
        date,
        notes,
        next,
      )
    }
    await editeSafeMony(newMony, date, notes, resposibleName)
    const existingCus = await CustomerModel.findById(sales?.[0]?.customer)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Sale Return part Order (${
        sales?.[0]?.order
      }) of customer ($${
        existingCus ? existingCus?.name : existingSale?.cashCustomer
      }) Successfully`,
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
) {
  let productQty,
    salePrice = 0,
    existingProduct

  existingProduct = await ProductModel.findOne({ product, sku })
  productQty = await FetchProductQty(sku, product, price, warehouse)
  salePrice = parseInt(price)

  try {
    if (productQty) {
      await ProductQtyModel.updateOne(
        {
          sku,
          product,
          warehouse,
          salePrice: parseInt(salePrice),
        },
        { $inc: { qty: parseInt(qty) } },
      )
    } else {
      await ProductQtyModel.create({
        sku,
        product,
        warehouse,
        date,
        qty: parseInt(qty),
        buyPrice: parseInt(existingProduct?.buyPrice),
        salePrice: parseInt(salePrice),
        notes,
      })
    }
  } catch (err) {}
}

async function FetchProductQty(sku, product, price, warehouse) {
  let productQty = await ProductQtyModel.findOne({
    sku,
    product,
    salePrice: price,
    warehouse,
  }).sort({ qty: -1 })

  return productQty
}

async function editeSafeMony(mony, date, notes, name) {
  let safeId = '1'
  const existingSafe = await SafeModel.findById(safeId)
  const existingMony = await MoniesModel.findOne({ safe: safeId })
  const safeMony = existingMony?.mony

  if (!existingMony) {
    return {
      valid: false,
      message: `The Safe Not Found`,
    }
  }
  if (safeMony <= 0) {
    return {
      valid: false,
      message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
    }
  }
  if (safeMony < mony) {
    return {
      valid: false,
      message: `The Mony (${mony}) Require More Mony in The Safe (${existingSafe?.title}) `,
    }
  }
  try {
    await MonyPulledModel.create({
      safe: safeId,
      mony,
      date,
      name,
      typePulled: 'Sale Return Order',
      notes,
    })
    await MoniesModel.updateOne(
      { safe: safeId },
      {
        $inc: { mony: -parseInt(mony) },
      },
    )
  } catch (err) {}
}

async function generateOrderId() {
 try {
    let order =1
    const lastNumber = await ReturnSaleModel.findOne().sort({
      _id: -1,
    })
    order = lastNumber ? parseInt(lastNumber.returnId) + 1 : 1
    return order
  } catch (error) {}
}
