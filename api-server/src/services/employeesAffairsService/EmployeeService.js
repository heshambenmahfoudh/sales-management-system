import EmployeeModel from '../../models/employeesAffairsModels/EmployeeModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateEmployee(req, res, next) {
  const {
    name,
    phone,
    address,
    idNumber,
    salary,
    date,
    notes,
    imageUrl,
  } = req.body

  try {
    const check = await checkExistingEmployee(name, phone, idNumber)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }
    const newEmployee = await EmployeeModel.create({
      name,
      phone,
      address,
      idNumber,
      salary,
      date,
      notes,
      imageUrl,
    })
    const savedEmployee = await newEmployee.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New employee 
           (${newEmployee.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedEmployee })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Employee'))
  }
}

export async function getEmployeeById(req, res, next) {
  const { id } = req.params
  try {
    const employee = await EmployeeModel.findById(id)
    if (!employee) {
      return next(new ApiErr(FAIL, 403, ` Employee Not Found `))
    }
    res.status(200).json({ status: SUCCESS, data: employee })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Employee'))
  }
}

export async function updatedEmployeeById(req, res, next) {
  const { id } = req.params
  const {
    name,
    phone,
    address,
    idNumber,
    salary,
    date,
    notes,
    imageUrl,
  } = req.body

  try {
    const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
      id,
      {
        $set: { name, phone, address, idNumber, salary, date, notes, imageUrl },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated employee 
           (${updatedEmployee.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedEmployee })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Employee'))
  }
}

export async function deletedEmployeeById(req, res, next) {
  const { id } = req.params
  try {
    const existingEmployee = await EmployeeModel.findById(id)
    await EmployeeModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted employee 
           (${existingEmployee.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Employee has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Employee'))
  }
}

export async function getAllEmployees(req, res, next) {
  const { name } = req.query
  const searchByName = {}
  if (name) {
    searchByName.name = {
      $regex: name,
    }
  }
  try {
    const employees = await EmployeeModel.find(searchByName).sort({
      createdAt: -1,
    })
    res.status(200).json({ status: SUCCESS, data: employees })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Employees'))
  }
}

/*FUNCTIONS*/

async function checkExistingEmployee(name, phone, idNumber) {
  const oldEmployName = await EmployeeModel.findOne({ name })
  const oldEmployPhone = await EmployeeModel.findOne({ phone })
  const oldEmployIdNumber = await EmployeeModel.findOne({ idNumber })
  if (oldEmployName) {
    return {
      valid: false,
      message: `Employ Name (${name}) Alredy Created `,
    }
  }
  if (oldEmployPhone) {
    return {
      valid: false,
      message: `Employ Phone (${phone}) Alredy Created `,
    }
  }
  if (oldEmployIdNumber) {
    return {
      valid: false,
      message: `Employ Id Number (${idNumber}) Alredy Created `,
    }
  }
}
