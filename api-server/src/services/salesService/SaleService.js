import mongoose from 'mongoose'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import SaleModel from '../../models/salesModels/SaleModel.js'
import CustomerMonyModel from '../../models/customersModels/CustomerMonyModel.js'
import ProductQtyModel from '../../models/inventoryModels/ProductQtyModel.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyDepositeModel from '../../models/safesModels/MonyDepositeModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import CustomerModel from '../../models/customersModels/CustomerModel.js'

export async function CreateSale(req, res, next) {
  const {
    customer,
    products,
    cashCustomer,
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
    await session.startTransaction()
    if (cashCustomer && parseInt(totalItemsPrice) !== parseInt(pay)) {
      return next(
        new ApiErr(
          FAIL,
          402,
          `Plesae Pay the Total price (${totalItemsPrice})`,
        ),
      )
    }
    if (pay > totalItemsPrice) {
      return next(new ApiErr(FAIL, 402, `Can't pay mony large total order`))
    }
    const order = await generateOrderId('sale')
    for (const product of products) {
      const check = await checkProductQty(
        product?._id,
        product?.sku,
        product?.qty,
      )
      if (check?.valid === false) {
        return next(new ApiErr(FAIL, 402, check?.message))
      }

      await SaleModel.create({
        order,
        customer,
        cashCustomer,
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

      await updateQtyInWareHouse(product?._id, product?.sku, product?.qty)
    }

    await depositeMonySafe(pay, date, notes, resposibleName)

    const customerMonyId = await generateOrderId()
    if (balance > 0) {
      await CustomerMonyModel.create({
        customerMonyId,
        order,
        customer,
        totalItemsPrice,
        pay: parseInt(pay),
        balance: parseInt(balance),
        dateMaturity,
        date,
      })
    } else {
      await CustomerMonyModel.create({
        customerMonyId,
        order,
        customer,
        totalItemsPrice,
        pay: parseInt(pay),
        balance: parseInt(balance),
        date,
      })
    }
    const userSession = await getUserSession(req, res, next)
    const existing = await CustomerModel.findById(customer)
    const existingSafe = await SafeModel.findById('1')

    const userLog_1 = {
      user: userSession?._id,
      activity: `User (${
        userSession?.name
      }) Created New Sale order (${order}) of Customer (${
        cashCustomer ? cashCustomer : existing?.name
      }) Successfully`,
    }
    const userLog_2 = {
      user: userSession?._id,
      activity: `User (${userSession?.name}) Pay ($${pay}) of Sale Order (${order}) from Safe (${existingSafe?.title}) Successfully`,
    }
    const userLog_3 = {
      user: userSession?._id,
      activity: `User (${userSession?.name}) Created New Customer Mony of Sale Order (${order}) pay ($${pay}) balance ($${balance}) of Customer ($${existing?.name}) Successfully`,
    }
    if (customer) {
      await createNewUserLog(userLog_3, req, res, next)
    }
    await createNewUserLog(userLog_2, req, res, next)
    await createNewUserLog(userLog_1, req, res, next)

    res.status(200).json({
      status: SUCCESS,
      message: 'sale order created successfully',
    })
    await session.commitTransaction()
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Sale'))
    await session.abortTransaction()
  } finally {
    await session.endSession()
  }
}

export async function getSaleById(req, res, next) {
  const { id: order } = req.params
  if (!order || order === 'undefined') {
    return next(new ApiErr(FAIL, 402, 'Please Write The Order Number'))
  }
  try {
    const existingSale = await SaleModel.find({
      order,
    }).populate([
      { path: 'customer', select: 'name' },
      { path: 'product' },
      { path: 'unit', select: 'title' },
    ])

    if (!order || existingSale?.length < 1) {
      return next(new ApiErr(FAIL, 403, ` Sale Order Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: existingSale })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Sale'))
  }
}

export async function deletedSaleById(req, res, next) {
  const { id } = req.params
  try {
    const existing = await SaleModel.findById(id)
    const existingCus = await CustomerModel.findById(existing?.customer)
    await SaleModel.deleteMany({ order: existing.order })
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Sale Order (${
        existing?.order
      }) of customer (${
        existingCus ? existingCus?.name : existing?.cashCustomer
      }) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)

    res.status(200).json({
      status: SUCCESS,
      message: 'Sale has been Deleted',
    })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Deleted Sale'))
  }
}

export async function getAllSales(req, res, next) {
  const { order } = req.query
  let filterAndSearch = {}

  if (order) {
    filterAndSearch.order = order
  }
  if (order === false || order === '' || order === 'undefined') {
    return next(new ApiErr(FAIL, 402, 'Please Write The Order Number'))
  }
  try {
    const sales = await SaleModel.find(filterAndSearch)
      .populate([
        { path: 'customer', select: 'name' },
        { path: 'product' },
        { path: 'unit', select: 'title' },
      ])
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: sales })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Fetching Sales'))
  }
}

/*FUNCTIONS*/
async function updateQtyInWareHouse(product, sku, qty) {
  let existWareHouse
  let qtyInWarehouse = 0,
    qtyRequired,
    productSku,
    existProduct
  let productQty = await FetchProductQty(sku, product)

  qtyRequired = parseInt(qty)
  existWareHouse = productQty?.[0]?.warehouse
  qtyInWarehouse = productQty?.[0]?.qty
  productSku = productQty?.[0]?.sku
  existProduct = productQty?.[0]?.product

  //  status one
  if (qtyInWarehouse - parseInt(qtyRequired) >= 1) {
    await updateProductQty(
      productSku,
      existProduct,
      existWareHouse,
      qtyInWarehouse,
      qtyRequired,
    )

    // status two
  } else if (qtyInWarehouse - parseInt(qtyRequired) === 0) {
    await updateProductQty(
      productSku,
      existProduct,
      existWareHouse,
      qtyInWarehouse,
      qtyRequired,
    )

    await deleteProductQty()

    // status three
  } else if (qtyInWarehouse - parseInt(qtyRequired) < 0) {
    let realBaki = Math.abs(qtyInWarehouse - parseInt(qtyRequired))

    await updateProductQty(
      productSku,
      existProduct,
      existWareHouse,
      qtyInWarehouse,
      qtyRequired,
    )

    await deleteProductQty()
    productQty = await ProductQtyModel.find({
      sku,
      product,
    }).sort({ qty: -1 })

    existWareHouse = productQty?.[0]?.warehouse
    qtyInWarehouse = productQty?.[0]?.qty
    if (qtyInWarehouse - realBaki >= 0) {
      await updateProductQty(
        productSku,
        existProduct,
        existWareHouse,
        qtyInWarehouse,
        realBaki,
      )

      await deleteProductQty()
    } else if (qtyInWarehouse - realBaki < 0) {
      let secondRealBaki = Math.abs(qtyInWarehouse - realBaki)

      await updateProductQty(
        productSku,
        existProduct,
        existWareHouse,
        qtyInWarehouse,
        qtyInWarehouse,
      )

      await deleteProductQty()

      productQty = await FetchProductQty(brand, category, product)
      existWareHouse = productQty?.[0]?.warehouse
      qtyInWarehouse = productQty?.[0]?.qty

      if (qtyInWarehouse - secondRealBaki >= 0) {
        await updateProductQty(
          productSku,
          existProduct,
          existWareHouse,
          qtyInWarehouse,
          secondRealBaki,
        )

        await deleteProductQty()
      } else if (qtyInWarehouse - secondRealBaki < 0) {
        let thirdRealBaki = Math.abs(qtyInWarehouse - secondRealBaki)
        await updateProductQty(
          productSku,
          existProduct,
          existWareHouse,
          qtyInWarehouse,
          qtyInWarehouse,
        )

        await deleteProductQty()

        productQty = await FetchProductQty(brand, category, product)
        existWareHouse = productQty?.[0]?.warehouse
        qtyInWarehouse = productQty?.[0]?.qty

        if (qtyInWarehouse - thirdRealBaki >= 0) {
          await updateProductQty(
            productSku,
            existProduct,
            existWareHouse,
            qtyInWarehouse,
            thirdRealBaki,
          )

          await deleteProductQty()
        } else if (qtyInWarehouse - thirdRealBaki < 0) {
          let fourthRealBaki = Math.abs(qtyInWarehouse - thirdRealBaki)
          await updateProductQty(
            productSku,
            existProduct,
            existWareHouse,
            qtyInWarehouse,
            qtyInWarehouse,
          )
          await deleteProductQty()

          productQty = await FetchProductQty(brand, category, product)
          existWareHouse = productQty?.[0]?.warehouse
          qtyInWarehouse = productQty?.[0]?.qty

          if (qtyInWarehouse - fourthRealBaki >= 0) {
            await updateProductQty(
              productSku,
              existProduct,
              existWareHouse,
              qtyInWarehouse,
              fourthRealBaki,
            )

            await deleteProductQty()
          } else if (qtyInWarehouse - fourthRealBaki < 0) {
            let fiveRealBaki = Math.abs(qtyInWarehouse - fourthRealBaki)

            await updateProductQty(
              productSku,
              existProduct,
              existWareHouse,
              qtyInWarehouse,
              qtyInWarehouse,
            )

            await deleteProductQty()

            productQty = await FetchProductQty(brand, category, product)
            existWareHouse = productQty?.[0]?.warehouse
            qtyInWarehouse = productQty?.[0]?.qty
            if (qtyInWarehouse - fiveRealBaki >= 0) {
              await updateProductQty(
                productSku,
                existProduct,
                existWareHouse,
                qtyInWarehouse,
                fiveRealBaki,
              )

              await deleteProductQty()
            } else if (qtyInWarehouse - fiveRealBaki < 0) {
              let sixRealBaki = Math.abs(qtyInWarehouse - fiveRealBaki)

              await updateProductQty(
                productSku,
                existProduct,
                existWareHouse,
                qtyInWarehouse,
                qtyInWarehouse,
              )

              await deleteProductQty()

              productQty = await FetchProductQty(brand, category, product)
              existWareHouse = productQty?.[0]?.warehouse
              qtyInWarehouse = productQty?.[0]?.qty
              if (qtyInWarehouse - sixRealBaki >= 0) {
                await updateProductQty(
                  existSku,
                  existProduct,
                  existWareHouse,
                  qtyInWarehouse,
                  sixRealBaki,
                )
                await deleteProductQty()
              } else if (qtyInWarehouse - sixRealBaki < 0) {
                await updateProductQty(
                  productSku,
                  existProduct,
                  existWareHouse,
                  qtyInWarehouse,
                  qtyInWarehouse,
                )
                await deleteProductQty()
              }
            }
          }
        }
      }
    }
  }
}

async function updateProductQty(
  productSku,
  existProduct,
  existWareHouse,
  qtyInWarehouse,
  qtyRequired,
) {
  try {
    await ProductQtyModel.updateOne(
      {
        sku: productSku,
        product: existProduct,
        warehouse: existWareHouse,
        qty: qtyInWarehouse,
      },
      { $inc: { qty: -parseInt(qtyRequired) } },
    )
  } catch (err) {}
}

async function deleteProductQty() {
  try {
    return await ProductQtyModel.deleteOne({
      qty: { $lte: 0 },
    })
  } catch (err) {}
}

async function FetchProductQty(sku, product) {
  let productQty = await ProductQtyModel.find({
    sku,
    product,
  }).sort({ qty: -1 })

  return productQty
}

async function checkProductQty(product, sku, qty) {
  let productQty = await FetchProductQty(sku, product)
  let allQty = 0
  productQty?.forEach(({ qty }) => {
    allQty += qty
    return allQty
  })
  let productName = await ProductModel.findOne({ product, sku })
  if (qty > allQty) {
    return {
      valid: false,
      message: `the Qty Required of Product (${productName?.title}) the Large of Found in The Warehouse (${allQty})`,
    }
  }
  if ((productQty?.length || allQty) <= 0) {
    return {
      valid: false,
      message: `the Product (${productName?.title}) Qty Not Found In The Warehouse`,
    }
  }
}

async function depositeMonySafe(mony, date, notes, name) {
  let safeId = '1'
  try {
    await MonyDepositeModel.create({
      safe: safeId,
      mony,
      date,
      name,
      typeDeposite: 'Sale Order',
      notes,
    })

    await MoniesModel.updateOne(
      { safe: safeId },
      {
        $inc: { mony: parseInt(mony) },
      },
    )
  } catch (err) {}
}

async function generateOrderId(status) {
  try {
    let order = 1
    if (status === 'sale') {
      const lastOrder = await SaleModel.findOne({}).sort({ _id: -1 })
      let newOrder = 1
      if (lastOrder && lastOrder.order) {
        const lastId = lastOrder.order.split('-')[1]
        newOrder = parseInt(lastId, 10) + 1
      }
      const addedNum = String(newOrder).padStart(3, '0')
      order = `ORD-${addedNum}`
    } else {
      const lastNumber = await CustomerMonyModel.findOne().sort({
        customerMonyId: -1,
      })
      order = lastNumber ? parseInt(lastNumber.customerMonyId) + 1 : 1
    }

    return order
  } catch (error) {}
}
