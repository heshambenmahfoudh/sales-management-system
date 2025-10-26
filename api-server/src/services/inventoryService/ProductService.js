import ProductModel from '../../models/inventoryModels/ProductModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function createProduct(req, res, next) {
  const {
    imageUrl,
    title,
    category,
    brand,
    unit,
    buyPrice,
    salePrice,
    sku,
    totalPrice,
    description,
    notes,
  } = req.body

  try {
    const oldProductTitle = await ProductModel.findOne({
      title,
      brand,
      category,
    })
    if (oldProductTitle) {
      return next(new ApiErr(FAIL, 402, `Product alredy created`))
    }
    const oldProductSku = await ProductModel.findOne({ sku })
    if (oldProductSku) {
      return next(new ApiErr(FAIL, 402, `Product sku (${sku}) alredy created`))
    }

    const newProduct = await ProductModel.create({
      imageUrl,
      title,
      category,
      brand,
      unit,
      buyPrice,
      salePrice,
      sku,
      totalPrice,
      description,
      notes,
    })
    const savedProduct = await newProduct.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Product (${newProduct?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedProduct })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Product'))
  }
}

export async function updateProductById(req, res, next) {
  const { id } = req.params
  const {
    imageUrl,
    title,
    category,
    brand,
    unit,
    priceOfPart,
    proQty,
    sku,
    buyPrice,
    salePrice,
    totalPrice,
    description,
    notes,
  } = req.body

  try {
    const updatedProdutc = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: {
          imageUrl,
          title,
          category,

          brand,

          unit,

          sku,
          buyPrice: parseInt(buyPrice),
          salePrice: parseInt(salePrice),
          priceOfPart: parseInt(priceOfPart),
          proQty: parseInt(proQty),
          totalPrice: parseInt(totalPrice),
          description,
          notes,
        },
      },
      { new: true },
    )

    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Product (${updatedProdutc?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedProdutc })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Updated Product'))
  }
}

export async function deleteProductById(req, res, next) {
  const { id } = req.params
  try {
    const existing = await ProductModel.findById(id)
    await ProductModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Product (${existing?.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)

    res
      .status(200)
      .json({ status: SUCCESS, message: 'product has been deleted' })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Product'))
  }
}

export async function getProductById(req, res, next) {
  const { id } = req.params

  try {
    const product = await ProductModel.findById(id).populate([
      { path: 'brand', select: 'title' },
      { path: 'category', select: 'title' },
      { path: 'unit', select: 'title' },
    ])

    if (!product) {
      return next(new ApiErr(FAIL, 403, ` Product Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: product })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Product'))
  }
}

export async function getAllProducts(req, res, next) {
  const { name: title, sku } = req.query
  const searchAndFilter = {}
  if (sku && sku !== 'true') {
    searchAndFilter.sku = sku
  }
  if (title) {
    searchAndFilter.title = {
      $regex: title,
    }
  }
  const projection = sku === 'true' ? { sku: 1 } : {}
  try {
    const products = await ProductModel.find(searchAndFilter, projection)
      .populate([
        { path: 'brand', select: 'title' },
        { path: 'category', select: 'title' },
        { path: 'unit', select: 'title' },
      ])
      .sort({
        createdAt: -1,
      })
    res.status(200).json({ status: SUCCESS, data: products })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Products'))
  }
}
