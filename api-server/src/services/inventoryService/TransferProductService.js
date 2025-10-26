import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import ProductQtyModel from '../../models/inventoryModels/ProductQtyModel.js'
import WareHouseModel from '../../models/inventoryModels/WareHouseModel.js'
import TransferProductModel from '../../models/inventoryModels/TransferProductModel.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import { createNewUserLog } from '../usersService/UserLogService.js'
import { getUserSession } from '../usersService/AuthService.js'

export async function CreateTransferProduct(req, res, next) {
  const {
    fromWarehouse,
    toWarehouse,
    product,
    unit,
    qty,
    buyPrice,
    salePrice,
    date,
    notes,
    responsibleName,
  } = req.body

  try {
    const existingProduct = await ProductModel.findById(product)
    const sku = existingProduct?.sku
    const check = await checkProductQty(
      fromWarehouse,
      toWarehouse,
      sku,
      product,
      qty,
    )
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 401, check?.message))
    }
    await updateQtyInWareHouse(sku, product, qty, fromWarehouse, next)

    const newTransferProduct = await TransferProductModel.create({
      fromWarehouse,
      toWarehouse,
      responsibleName,
      sku,
      product,
      unit,
      qty: parseInt(qty),
      buyPrice: parseInt(buyPrice),
      salePrice: parseInt(salePrice),
      date,
      notes,
    })
    await updateOrCreateProductQty(
      sku,
      product,
      toWarehouse,
      date,
      qty,
      buyPrice,
      salePrice,
      notes,
    )

    const savedTransferProduct = await newTransferProduct.save()
    const session = await getUserSession(req, res, next)
    const existingPro = await ProductModel.findById(product)
    const existingFrom = await WareHouseModel.findById(fromWarehouse)
    const existingTo = await WareHouseModel.findById(toWarehouse)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Transfer product (${existingPro?.title}) qty (${qty}) from warehouse (${existingFrom?.title}) to warehouse (${existingTo?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      data: savedTransferProduct,
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Transfer Product'))
  }
}

export async function getTransferProductById(req, res, next) {
  const { id } = req.params
  try {
    const transferProduct = await TransferProductModel.findById(id)
      .populate([
        { path: 'fromWarehouse', select: 'title' },
        { path: 'toWarehouse', select: 'title' },
        { path: 'product' },
        { path: 'unit', select: 'title' },
      ])
      .sort({ createdAt: -1 })
    if (!transferProduct) {
      return next(new ApiErr(FAIL, 403, `Transfer Product Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: transferProduct })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching transfer Product'))
  }
}

export async function deletedTransferProductById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await TransferProductModel.findById(id)
    const existPro = await ProductModel.findById(exist.product)
    const existFrom = await WareHouseModel.findById(exist.fromWarehouse)
    const existTo = await WareHouseModel.findById(exist.toWarehouse)
    await TransferProductModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Transfer product (${existPro?.title}) qty (${exist?.qty}) from warehouse (${existFrom?.title}) to (${existTo?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Transfer product has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Transfer product'))
  }
}

export async function getAllTransferProducts(req, res, next) {
  try {
    const transferProducts = await TransferProductModel.find()
      .populate([
        { path: 'fromWarehouse', select: 'title' },
        { path: 'toWarehouse', select: 'title' },
        { path: 'product' },
        { path: 'unit', select: 'title' },
      ])
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: transferProducts })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Transfer Products'))
  }
}

/*FUNCTIONS*/

async function updateQtyInWareHouse(sku, product, qty, fromWarehouse, next) {
  try {
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

      qtyInWarehouse = productQty?.[0].qty
      if (qtyInWarehouse - realBaki >= 0) {
        await updateProductQty(
          productSku,
          existProduct,
          qtyInWarehouse,
          realBaki,
        )

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
          .qty
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
          qtyInWarehouse = await FetchProductQty(
            sku,
            product,
            fromWarehouse,
          )?.[0].qty
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
            )?.[0].qty
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
              )?.[0].qty
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
                )?.[0].qty
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
  } catch (error) {}
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

async function checkProductQty(fromWarehouse, toWarehouse, sku, product, qty) {
  try {
    if (fromWarehouse === toWarehouse) {
      return {
        valid: false,
        message: `Can't Transfer from ,to the same Warehouse`,
      }
    }
    const id = fromWarehouse?.toString()
    const existingWareHouse = await WareHouseModel.findById(id)
    const wareHouseTitle = existingWareHouse?.title
    const productQty = await FetchProductQty(sku, product, fromWarehouse)

    let sumAllQty = 0
    productQty.forEach(({ qty }) => {
      sumAllQty += qty
      return sumAllQty
    })
    if (sumAllQty <= 0) {
      return {
        valid: false,
        message: `Not Found Products In this wareHose (${wareHouseTitle}) `,
      }
    }

    if (parseInt(qty) > sumAllQty) {
      return {
        valid: false,
        message: `the Product Qty Requierd the Large Of Product Qty in wareHouse (${wareHouseTitle})`,
      }
    }
  } catch (err) {}
}

async function updateOrCreateProductQty(
  sku,
  product,
  toWarehouse,
  date,
  qty,
  buyPrice,
  salePrice,
  notes,
) {
  try {
    let productQuantitaies = await ProductQtyModel.find()
    let productQtyLength = productQuantitaies?.length
    let existingProductQty = await ProductQtyModel.find({
      sku,
      product,
      warehouse: toWarehouse,
      buyPrice: parseInt(buyPrice),
      sellPrice: parseInt(salePrice),
    })
    if (existingProductQty?.length <= 0) {
      await ProductQtyModel.create({
        qtyId: productQtyLength + 1,
        sku,
        product,
        warehouse: toWarehouse,
        date,
        qty: parseInt(qty),
        buyPrice: parseInt(buyPrice),
        salePrice: parseInt(salePrice),
        notes,
      })
    } else {
      await ProductQtyModel.updateOne(
        {
          sku,
          product,
          buyPrice: parseInt(buyPrice),
          salePrice: parseInt(salePrice),
          warehouse: toWarehouse,
        },
        {
          $inc: { qty: parseInt(qty) },
        },
      )
    }
  } catch (err) {}
}
