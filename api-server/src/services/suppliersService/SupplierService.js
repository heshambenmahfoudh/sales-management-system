import SupplierModel from '../../models/suppliersModels/SupplierModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateSupplier(req, res, next) {
  const { name, phone, email, address, notes } = req.body

  try {
    const check = await checkExistingSuppliers(name, phone, email)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }
    const newSupplier = await SupplierModel.create({
      name,
      phone,
      email,
      address,
      notes,
    })
    const savedSupplier = await newSupplier.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New Supplier (${newSupplier?.name}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedSupplier })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Supplier'))
  }
}

export async function getSupplierById(req, res, next) {
  const { id } = req.params
  try {
    const supplier = await SupplierModel.findById(id)
    if (!supplier) {
      return next(new ApiErr(FAIL, 403, ` Supplier Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: supplier })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Supplier'))
  }
}

export async function updateSupplierById(req, res, next) {
  const { id } = req.params
  const { name, phone, email, address, notes } = req.body
  try {
    const updatedSupplier = await SupplierModel.findByIdAndUpdate(
      id,
      { $set: { name, phone, email, address, notes } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Supplier (${updatedSupplier?.name}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedSupplier })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Supplier'))
  }
}

export async function deletedSupplierById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await SupplierModel.findById(id)
    await SupplierModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Supplier (${exist?.name}) Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Supplier has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Supplier'))
  }
}

export async function getAllSuppliers(req, res, next) {
  const { name } = req.query
  const searchAndFilter = {}
  if (name) {
    searchAndFilter.name = {
      $regex: name,
    }
  }

  try {
    const suppliers = await SupplierModel.find(searchAndFilter).sort({
      createdAt: -1,
    })
    console.log('suppliers', suppliers)

    res.status(200).json({ status: SUCCESS, data: suppliers })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Suppliers'))
  }
}

/*FUNCTIONS*/

async function checkExistingSuppliers(name, phone, email) {
  try {
    const oldSupplierName = await SupplierModel.findOne({ name })
    if (oldSupplierName) {
      return {
        valid: false,
        message: `Supplier (${name}) Alredy Created `,
      }
    }
    const oldSupplierPhone = await SupplierModel.findOne({ phone })
    if (oldSupplierPhone) {
      return {
        valid: false,
        message: `Supplier (${phone}) Alredy Created `,
      }
    }
    const oldSupplierEmail = await SupplierModel.findOne({ email })
    if (oldSupplierEmail) {
      return {
        valid: false,
        message: `Supplier (${email}) Alredy Created `,
      }
    }
  } catch (error) {}
}
