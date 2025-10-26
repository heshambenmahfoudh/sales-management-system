import CategoryModel from '../../models/inventoryModels/CategoryModel.js'
import ProductModel from '../../models/inventoryModels/ProductModel.js'
import ApiErr from '../../utils/apiErr.js'
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateCategory(req, res, next) {
  const { brand, title } = req.body

  try {
    const oldCategory = await CategoryModel.findOne({ title, brand })
    if (oldCategory) {
      return next(
        new ApiErr(FAIL, 403, `Category (${title}) of brand Alredy Created `),
      )
    }
    const newCategory = await CategoryModel.create({
      brand,
      title,
    })
    const savedCategory = await newCategory.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New category (${newCategory.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedCategory })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Category'))
  }
}

export async function getCategoryById(req, res, next) {
  const { id } = req.params
  try {
    const category = await CategoryModel.findById(id).populate({
      path: 'brand',
      select: 'title',
    })
    if (!category) {
      return next(new ApiErr(FAIL, 403, ` Category Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: category })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Category'))
  }
}

export async function updatedCategoryById(req, res, next) {
  const { id } = req.params
  const { brand, title } = req.body

  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { $set: { brand, title } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated category (${updatedCategory.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedCategory })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Category'))
  }
}

export async function deletedCategoryById(req, res, next) {
  const { id } = req.params
  try {
    const category = await CategoryModel.findById(id)
    await ProductModel.deleteMany({ category: category._id })
    await CategoryModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted category (${category.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Category has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Category'))
  }
}

export async function getAllCategory(req, res, next) {
  const { brand, name: title } = req.query
  const searchAndFilter = {}
  if (brand) {
    searchAndFilter.brand = brand
  }
  if (title) {
    searchAndFilter.title = {
      $regex: title,
    }
  }
  console.log(brand)

  try {
    const categories = await CategoryModel.find(searchAndFilter)
      .populate({
        path: 'brand',
        select: 'title',
      })
      .sort({ createdAt: -1 })

    res.status(200).json({ status: SUCCESS, data: categories })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Categories'))
  }
}
