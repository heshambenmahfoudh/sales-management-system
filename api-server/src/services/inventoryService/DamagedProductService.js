import ProductQtyModel from '../../models/inventoryModels/ProductQtyModel.js'
import WareHouseModel from '../../models/inventoryModels/WareHouseModel.js'
import DamagedProductModel from '../../models/inventoryModels/DamagedProductModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateDamagedProduct(req, res, next) {
  const {
    fromWarehouse,
    responsibleName,
    product,
    unit,
    qty,
    date,
    notes,
  } = req.body

  try {
    const existingProduct = await ProductModel.findById(product)
    const sku = existingProduct?.sku
    const check = await checkProductQty(sku, product, fromWarehouse, qty)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 401, check?.message))
    }
    await updateQtyInWareHouse(sku, product, qty, fromWarehouse, next)

    const newDamagedProduct = await DamagedProductModel.create({
      fromWarehouse,
      responsibleName,
      sku,
      product,
      unit,
      qty: parseInt(qty),
      date,
      notes,
    })

    const savedDamagedProduct = await newDamagedProduct.save()
    const session = await getUserSession(req, res, next)
    const existingWare = await WareHouseModel.findById(fromWarehouse)
    const existingPro = await ProductModel.findById(product)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New damaged product (${existingPro?.title}) qty (${qty}) from warehouse (${existingWare?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      data: savedDamagedProduct,
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Damaged Product'))
  }
}

export async function getDamagedProductById(req, res, next) {
  const { id } = req.params
  try {
    const damagedProduct = await DamagedProductModel.findById(id)
      .populate([
        { path: 'fromWarehouse', select: 'title' },
        { path: 'product' },
        { path: 'unit', select: 'title' },
      ])
      .sort({ createdAt: -1 })
    if (!damagedProduct) {
      return next(new ApiErr(FAIL, 403, `Damaged Product Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: damagedProduct })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Damaged Product'))
  }
}

export async function deletedDamagedProductById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await DamagedProductModel.findById(id)
    const existPro = await ProductModel.findById(exist.product)
    const existWare = await WareHouseModel.findById(exist.fromWarehouse)
    await DamagedProductModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted damaged product (${existPro?.title}) qty (${exist?.qty}) from wareHouse (${existWare?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Damaged Product has been Deleted',
    })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Deleted Damaged Product'))
  }
}

export async function getAllDamagedProducts(req, res, next) {
  try {
    const damagedProducts = await DamagedProductModel.find()
      .populate([
        { path: 'fromWarehouse', select: 'title' },
        { path: 'product' },
        { path: 'unit', select: 'title' },
      ])
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: damagedProducts })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Damaged Products'))
  }
}

/*FUNCTION*/

async function updateQtyInWareHouse(sku, product, qty, fromWarehouse, next) {
  let productQty,
    qtyInWarehouse = 0,
    qtyRequired = 0,
    productSku,
    existProduct
  productQty = await FetchProductQty(sku, product, fromWarehouse)

  qtyRequired = parseInt(qty)
  qtyInWarehouse = productQty?.[0]?.qty
  productSku = productQty?.[0]?.sku
  existProduct = productQty?.[0]?.product

  //  status one
  if (qtyInWarehouse - parseInt(qtyRequired) >= 1) {
    await updateProductQty(
      productSku,
      existProduct,
      qtyInWarehouse,
      qtyRequired,
    )

    // status two
  } else if (qtyInWarehouse - parseInt(qtyRequired) === 0) {
    await updateProductQty(
      productSku,
      existProduct,
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
      qtyInWarehouse,
      qtyInWarehouse,
    )

    await deleteProductQty()
    productQty = await ProductQtyModel.find({
      sku,
      product,
      warehouse: fromWarehouse,
    }).sort({ qty: -1 })

    qtyInWarehouse = productQty?.[0]?.qty
    if (qtyInWarehouse - realBaki >= 0) {
      await updateProductQty(productSku, existProduct, qtyInWarehouse, realBaki)

      await deleteProductQty()
    } else if (qtyInWarehouse - realBaki < 0) {
      let secondRealBaki = Math.abs(qtyInWarehouse - realBaki)

      await updateProductQty(
        productSku,
        existProduct,
        qtyInWarehouse,
        qtyInWarehouse,
      )

      await deleteProductQty()

      qtyInWarehouse = await FetchProductQty(sku, product, fromWarehouse)?.[0]
        ?.qty
      if (qtyInWarehouse - secondRealBaki >= 0) {
        await updateProductQty(
          productSku,
          existProduct,
          qtyInWarehouse,
          secondRealBaki,
        )

        await deleteProductQty()
      } else if (qtyInWarehouse - secondRealBaki < 0) {
        let thirdRealBaki = Math.abs(qtyInWarehouse - secondRealBaki)
        await updateProductQty(
          productSku,
          existProduct,
          qtyInWarehouse,
          qtyInWarehouse,
        )

        await deleteProductQty()
        qtyInWarehouse = await FetchProductQty(sku, product, fromWarehouse)?.[0]
          ?.qty
        if (qtyInWarehouse - thirdRealBaki >= 0) {
          await updateProductQty(
            productSku,
            existProduct,
            qtyInWarehouse,
            thirdRealBaki,
          )

          await deleteProductQty()
        } else if (qtyInWarehouse - thirdRealBaki < 0) {
          let fourthRealBaki = Math.abs(qtyInWarehouse - thirdRealBaki)
          await updateProductQty(
            productSku,
            existProduct,
            qtyInWarehouse,
            qtyInWarehouse,
          )
          await deleteProductQty()
          qtyInWarehouse = await FetchProductQty(
            sku,
            product,
            fromWarehouse,
          )?.[0]?.qty
          if (qtyInWarehouse - fourthRealBaki >= 0) {
            await updateProductQty(
              productSku,
              existProduct,
              qtyInWarehouse,
              fourthRealBaki,
            )

            await deleteProductQty()
          } else if (qtyInWarehouse - fourthRealBaki < 0) {
            let fiveRealBaki = Math.abs(qtyInWarehouse - fourthRealBaki)

            await updateProductQty(
              productSku,
              existProduct,
              qtyInWarehouse,
              qtyInWarehouse,
            )

            await deleteProductQty()
            qtyInWarehouse = await FetchProductQty(
              sku,
              product,
              fromWarehouse,
            )?.[0]?.qty
            if (qtyInWarehouse - fiveRealBaki >= 0) {
              await updateProductQty(
                productSku,
                existProduct,
                qtyInWarehouse,
                fiveRealBaki,
              )

              await deleteProductQty()
            } else if (qtyInWarehouse - fiveRealBaki < 0) {
              let sixRealBaki = Math.abs(qtyInWarehouse - fiveRealBaki)

              await updateProductQty(
                productSku,
                existProduct,
                qtyInWarehouse,
                qtyInWarehouse,
              )

              await deleteProductQty()
              qtyInWarehouse = await FetchProductQty(
                sku,
                product,
                fromWarehouse,
              )?.[0]?.qty
              if (qtyInWarehouse - sixRealBaki >= 0) {
                await updateProductQty(
                  productSku,
                  existProduct,
                  qtyInWarehouse,
                  sixRealBaki,
                )
                await deleteProductQty()
              } else if (qtyInWarehouse - sixRealBaki < 0) {
                await updateProductQty(
                  productSku,
                  existProduct,
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
  qtyInWarehouse,
  qtyRequired,
) {
  try {
    await ProductQtyModel.updateOne(
      {
        sku: productSku,
        product: existProduct,
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

async function FetchProductQty(sku, product, fromWarehouse) {
  let productQty = await ProductQtyModel.find({
    sku,
    product,
    warehouse: fromWarehouse,
  }).sort({ qty: -1 })

  return productQty
}

async function checkProductQty(sku, product, fromWarehouse, qty) {
  try {
    const productQty = await FetchProductQty(sku, product, fromWarehouse)

    let sumAllQty = 0
    productQty?.forEach(({ qty }) => {
      sumAllQty += qty
      return sumAllQty
    })
    const id = fromWarehouse?.toString()
    const existingWareHouse = await WareHouseModel.findById(id)
    const wareHouseTitle = existingWareHouse?.title
    if (sumAllQty <= 0) {
      return {
        valid: false,
        message: `Not Found Products In this wareHouse (${wareHouseTitle}) `,
      }
    }

    if (parseInt(qty) > sumAllQty) {
      return {
        valid: false,
        message: `the Qty Product from Required Not Found in wareHouse (${wareHouseTitle}) `,
      }
    }
  } catch (err) {}
}
