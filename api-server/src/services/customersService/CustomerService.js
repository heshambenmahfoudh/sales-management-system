import CustomerModel from '../../models/customersModels/CustomerModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateCustomer(req, res, next) {
  const { name, phone, email, address, notes } = req.body

  try {
    const check = await checkExistingCustomer(name, phone, email)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }
    const newCustomer = await CustomerModel.create({
      name,
      phone,
      email,
      address,
      notes,
    })
    const savedCustomer = await newCustomer.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New customer 
       (${newCustomer.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedCustomer })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Customer'))
  }
}

export async function getCustomerById(req, res, next) {
  const { id } = req.params
  try {
    const customer = await CustomerModel.findById(id)
    if (!customer) {
      return next(new ApiErr(FAIL, 403, ` Customer Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: customer })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Customer'))
  }
}

export async function updateCustomerById(req, res, next) {
  const { id } = req.params
  const { name, phone, email, address, notes } = req.body
  try {
    const updatedCustomer = await CustomerModel.findByIdAndUpdate(
      id,
      { $set: { name, phone, email, address, notes } },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated customer 
       (${updatedCustomer.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedCustomer })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Customer'))
  }
}

export async function deletedCustomerById(req, res, next) {
  const { id } = req.params
  try {
    const exist = await CustomerModel.findById(id)
    await CustomerModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted customer 
       (${exist.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Customer has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Customer'))
  }
}

export async function getAllCustomers(req, res, next) {
  const { name } = req.query
  const searchByName = {}
  if (name) {
    searchByName.name = {
      $regex: name,
    }
  }
  try {
    const customers = await CustomerModel.find(searchByName).sort({
      createdAt: -1,
    })

    res.status(200).json({ status: SUCCESS, data: customers })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Customers'))
  }
}

/*FUNCTIONS*/

async function checkExistingCustomer(name, phone, email) {
  try {
    const oldCustomerName = await CustomerModel.findOne({ name })
    if (oldCustomerName) {
      return {
        valid: false,
        message: `Customer (${name}) Alredy Created `,
      }
    }
    const oldCustomerPhone = await CustomerModel.findOne({ phone })
    if (oldCustomerPhone) {
      return {
        valid: false,
        message: `Customer (${phone}) Alredy Created `,
      }
    }
    const oldCustomerEmail = await CustomerModel.findOne({ email })
    if (oldCustomerEmail) {
      return {
        valid: false,
        message: `Customer (${email}) Alredy Created `,
      }
    }
  } catch (error) {}
}
