import ProductModel from '../../models/inventoryModels/ProductModel.js'
import ProductQtyModel from '../../models/inventoryModels/ProductQtyModel.js'
import WareHouseModel from '../../models/inventoryModels/WareHouseModel.js'
import PurchaseModel from '../../models/purchasesModels/PurchaseModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateProductQty(req, res, next) {
  const { products, warehouse, date, notes } = req.body
  try {
    let newProductQty
    for (const pro of products) {
      const existingProductPrice = await ProductModel.find({
        _id: pro?.product,
      })
      const salePrice = existingProductPrice?.[0]?.salePrice
      const existingProduct = await ProductQtyModel.findOne({
        product: pro?.product,
        sku: pro?.sku,
        buyPrice: pro?.price,
        salePrice,
        warehouse,
      })
      const session = await getUserSession(req, res, next)
      const existingWare = await WareHouseModel.findById(warehouse)
      if (existingProduct) {
        await ProductQtyModel.updateMany(
          {
            product: pro?.product,
            buyPrice: pro?.price,
            sku: pro?.sku,
            salePrice,
            warehouse,
          },
          { $inc: { qty: parseInt(pro?.qty) } },
        )
        const existingPro = await ProductModel.findById(pro?.product)
        const userLog = {
          user: session?._id,
          activity: `User (${session?.name}) Created New Product Qty to exact product (${existingPro?.title}) qty (${pro?.qty}) to warehouse (${existingWare?.title}) Successfully`,
        }
        await createNewUserLog(userLog, req, res, next)
      } else {
        newProductQty = await ProductQtyModel.create({
          product: pro?.product,
          sku: pro?.sku,
          warehouse,
          date,
          qty: pro?.qty,
          buyPrice: pro?.price,
          salePrice,
          notes,
        })
        const existingPro = await ProductModel.findById(pro?.product)
        const userLog = {
          user: session?._id,
          activity: `User (${session?.name}) Created New Product Qty title (${existingPro?.title}) qty (${pro?.qty}) and price ($${pro?.price}) to warehouse (${existingWare?.title}) Successfully`,
        }
        await createNewUserLog(userLog, req, res, next)
      }
    }
    const order = products?.[0]?.order
    // await PurchaseModel.updateMany(
    //   { order },
    //   {
    //     $set: { isStored: true },
    //   },
    // )
    const savedProductQty = await newProductQty?.save()

    res.status(200).json({ status: SUCCESS, data: savedProductQty })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Product Qty'))
  }
}

export async function getProductQtyById(req, res, next) {
  const { id } = req.params
  try {
    const productQty = await ProductQtyModel.findById(id).populate([
      { path: 'product', select: 'title' },
      { path: 'warehouse', select: 'title' },
    ])
    if (!productQty || productQty?.length < 1) {
      return next(new ApiErr(FAIL, 403, ` Product Qty Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: productQty })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Product Qty'))
  }
}

export async function deletedProductQtyById(req, res, next) {
  const { id } = req.params
  try {
    const existing = await ProductQtyModel.findById(id)
    const existingWare = await WareHouseModel.findById(existing.warehouse)
    const existingPro = await ProductModel.findById(existing.product)
    await ProductQtyModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Product Qty (${existingPro?.title}) qty (${existing?.qty}) from warehouse (${existingWare?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Product Qty has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Product Qty'))
  }
}

export async function getAllProductsQty(req, res, next) {
  const { product, warehouse, limit } = req.query
  const existingProduct = await ProductModel.findById(product)
  const sku = existingProduct?.sku
  let filterAndSearch = {}

  if (sku) {
    filterAndSearch.sku = sku
  }
  if (warehouse) {
    filterAndSearch.warehouse = warehouse
  }

  try {
    const productsQty = limit
      ? await ProductQtyModel.find(filterAndSearch)
          .populate([
            { path: 'product', select: 'title' },
            { path: 'warehouse', select: 'title' },
          ])
          .limit(limit)
      : await ProductQtyModel.find(filterAndSearch)
          .populate([
            { path: 'product', select: 'title' },
            { path: 'warehouse', select: 'title' },
          ])
          .sort({ createdAt: -1 })
    console.log('query', req.query)

    res.status(200).json({ status: SUCCESS, data: productsQty })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Products Qty'))
  }
}
