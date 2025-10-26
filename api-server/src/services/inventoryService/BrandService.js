import BrandModel from '../../models/inventoryModels/BrandModel.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateBrand(req, res, next) {
  const { title } = req.body
  try {
    const oldBrand = await BrandModel.findOne({ title })
    if (oldBrand) {
      return next(new ApiErr(FAIL, 403, `Brand (${title}) Alredy Created `))
    }
    const newBrand = await BrandModel.create({ title })
    const savedBrand = await newBrand.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created new Brand (${newBrand.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedBrand })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Brand'))
  }
}

export async function getBrandById(req, res, next) {
  const { id } = req.params
  try {
    const brand = await BrandModel.findById(id)
    if (!brand) {
      return next(new ApiErr(FAIL, 403, ` Brand Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: brand })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Brand'))
  }
}

export async function updateBrandById(req, res, next) {
  const { id } = req.params
  const { title } = req.body

  try {
    const updatedBrand = await BrandModel.findByIdAndUpdate(
      id,
      { $set: { title } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Brand (${updatedBrand.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedBrand })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Brand'))
  }
}

export async function deletedBrandById(req, res, next) {
  const { id } = req.params
  try {
    const brand = await BrandModel.findById(id)
    await ProductModel.deleteMany({ brand: brand._id })
    await BrandModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Brand (${brand.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Brand has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Brand'))
  }
}

export async function getAllBrands(req, res, next) {
  const { name: title } = req.query
  const searchAndFilter = {}
  if (title) {
    searchAndFilter.title = {
      $regex: title,
    }
  }
  try {
    const brands = await BrandModel.find(searchAndFilter).sort({
      createdAt: -1,
    })
    res.status(200).json({ status: SUCCESS, data: brands })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Brands'))
  }
}
