import ApiErr from '../../utils/apiErr.js'
import WithdrawalsModel from '../../models/employeesAffairsModels/WithdrawalsModel.js'
import EmployeeModel from '../../models/employeesAffairsModels/EmployeeModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import MoniesModel from '../../models/safesModels/MoniesModel.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

export async function CreateWithdrawals(req, res, next) {
  const { safe, employee, responsible, mony, date, pay, notes } = req.body

  try {
    const check = await checkSafeMony(safe, mony)
    if (check?.valid === 'false') {
      return next(new ApiErr(FAIL, 403, check?.message))
    }

    const checkWithdrawals = await checkNumberWithdrawals(employee, mony)
    if (checkWithdrawals?.valid === 'false') {
      return next(new ApiErr(FAIL, 403, checkWithdrawals?.message))
    }

    const newWithdrawals = await WithdrawalsModel.create({
      employee,
      responsible,
      mony,
      date,
      pay,
      safe,
      notes,
    })
    const newMonyPull = await MonyPulledModel.create({
      safe,
      mony,
      date,
      typePulled: 'Withdrawals',
      name: responsible,
      notes,
    })
    await MoniesModel.updateOne(
      { safe },
      {
        $inc: { mony: -parseInt(mony) },
      },
    )
    const savedWithdrawals = await newWithdrawals.save()
    const savedMonyPull = await newMonyPull.save()
    const session = await getUserSession(req, res, next)
    const existingEmployee = await EmployeeModel.findById(employee)
    const existingSafe = await SafeModel.findById(safe)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New withdrawls ($${mony}) of employee
         (${existingEmployee.name}) from safe (${existingSafe.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      data: savedWithdrawals,
      savedMonyPull,
    })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Withdrawals'))
  }
}

export async function getWithdrawalsById(req, res, next) {
  const { id } = req.params
  try {
    const Withdrawals = await WithdrawalsModel.findById(id)
      .populate([
        { path: 'employee', select: 'name' },
        { path: 'safe', select: 'title' },
      ])
      .sort({ createdAt: -1 })
    if (!Withdrawals) {
      return next(new ApiErr(FAIL, 403, `Withdrawals Not Found `))
    }

    res.status(200).json({ status: SUCCESS, data: Withdrawals })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Withdrawals'))
  }
}

export async function deletedWithdrawalseById(req, res, next) {
  const { id } = req.params
  try {
    const existing = await WithdrawalsModel.findById(id)
    await WithdrawalsModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const existingEmployee = await EmployeeModel.findById(existing.employee)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted withdrawls of employee
         (${existingEmployee.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Withdrawals has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Withdrawals'))
  }
}

export async function getAllWithdrawals(req, res, next) {
  const { fromDate, toDate, employeeName: employee, pay } = req.query
  let filterAndSearchByDate = {}
  if (fromDate && toDate) {
    filterAndSearchByDate.date = {
      $gte: fromDate,
      $lte: toDate,
    }
  }
  if (employee) {
    filterAndSearchByDate.employee = employee
  }
  if (pay) {
    filterAndSearchByDate.pay = pay
  }

  try {
    let sumEmployeeWithdrawals = 0
    const Withdrawals = await WithdrawalsModel.find(filterAndSearchByDate)
      .populate([
        { path: 'employee', select: 'name' },
        { path: 'safe', select: 'title' },
      ])
      .sort({ createdAt: -1 })

    Withdrawals?.map(({ mony }) => {
      sumEmployeeWithdrawals += parseInt(mony)
    })
    res.status(200).json({
      status: SUCCESS,
      data: employee ? sumEmployeeWithdrawals : Withdrawals,
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Withdrawals'))
  }
}

/*FUNCTIONS*/

async function checkSafeMony(safe, mony) {
  try {
    const existingSafe = await SafeModel.findById(safe)
    const existingMony = await MoniesModel.findOne({ safe })
    const safeName = existingMony?.safe
    const safeMony = existingMony?.mony

    if (!safeName) {
      return {
        valid: false,
        message: `This Safe (${existingSafe?.title}) is Not Found`,
      }
    }
    if (safeMony <= 0) {
      return {
        valid: false,
        message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
      }
    }

    if (safeMony < mony) {
      return {
        valid: false,
        message: `The Mony Pulled (${mony}) More Mony in The Safe (${existingSafe?.title}) `,
      }
    }
  } catch (error) {}
}

async function checkNumberWithdrawals(employee, mony) {
  try {
    let sumEmployeeWithdrawals = 0
    const employeeName = await EmployeeModel.findById(employee)
    const Withdrawals = await WithdrawalsModel.find({
      employee,
      pay: false,
    })
    Withdrawals?.map(({ mony }) => {
      sumEmployeeWithdrawals += parseInt(mony)
    })
    if (sumEmployeeWithdrawals + parseInt(mony) > employeeName?.salary) {
      return {
        valid: false,
        message: `It is't possible Withdrawals The Large of Salary `,
      }
    }
  } catch (error) {}
}
