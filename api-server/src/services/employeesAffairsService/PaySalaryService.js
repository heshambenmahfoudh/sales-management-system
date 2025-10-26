import MoniesModel from '../../models/safesModels/MoniesModel.js'
import MonyPulledModel from '../../models/safesModels/MonyPulledModel.js'
import PaySalaryModel from '../../models/employeesAffairsModels/PaySalaryModel.js'
import SafeModel from '../../models/safesModels/SafeModel.js'
import WithdrawalsModel from '../../models/employeesAffairsModels/WithdrawalsModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, FAIL, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'
import EmployeeModel from '../../models/employeesAffairsModels/EmployeeModel.js'

export async function CreatePaySalary(req, res, next) {
  const {
    responsibleName,
    employee,
    salary,
    netWithdrawals,
    netSalary,
    givingDate,
    safe,
    dueDate,
    notes,
  } = req.body

  try {
    const check = await checkSafeMony(safe, netSalary)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }
    const newPaySalary = await PaySalaryModel.create({
      responsibleName,
      employee,
      safe,
      salary,
      netWithdrawals,
      netSalary,
      givingDate,
      dueDate,
      notes,
    })
    const newMonyPull = await MonyPulledModel.create({
      safe,
      mony: netSalary,
      date: givingDate,
      typePulled: 'pay salary',
      name: responsibleName,
      notes,
    })
    await MoniesModel.updateOne(
      { safe },
      {
        $inc: { mony: -parseInt(netSalary) },
      },
    )

    await WithdrawalsModel.updateMany(
      { employee },
      {
        $set: { pay: true },
      },
    )
    const savedPaySalary = await newPaySalary.save()
    const savedMonyPull = await newMonyPull.save()
    const session = await getUserSession(req, res, next)
    const existingEmployee = await EmployeeModel.findById(employee)
    const existingSafe = await SafeModel.findById(safe)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Pay Salary ($${netSalary}) of employee 
     (${existingEmployee.name}) and Pay withdrawls ($${netWithdrawals}) from safe (${existingSafe.title}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res
      .status(200)
      .json({ status: SUCCESS, data: savedPaySalary, savedMonyPull })
  } catch (err) {
    console.log(err)
    next(new ApiErr(ERR, 500, 'Failed to Create Pay Salary'))
  }
}

export async function getPaySalaryById(req, res, next) {
  const { id } = req.params
  try {
    const paySalary = await PaySalaryModel.findById(id).populate([
      {
        path: 'employee',
        select: 'name',
      },
      {
        path: 'safe',
        select: 'title',
      },
    ])
    if (!paySalary) {
      return next(
        new ApiErr(
          FAIL,
          403,
          ` 
        Pay Salary Not Found `,
        ),
      )
    }
    res.status(200).json({ status: SUCCESS, data: paySalary })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Pay Salary'))
  }
}

export async function deletedPaySalaryById(req, res, next) {
  const { id } = req.params
  try {
    const existingPaySalary = await PaySalaryModel.findById(id)
    await PaySalaryModel.findByIdAndDelete(id)
    const session = await getUserSession(req, res, next)
    const existingEmployee = await EmployeeModel.findById(
      existingPaySalary.employee,
    )
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted Pay Salary of employee
     (${existingEmployee.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({
      status: SUCCESS,
      message: 'Pay Salary has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted Pay Salary'))
  }
}

export async function getAllPaySalaries(req, res, next) {

  try {
    const paySalaries = await PaySalaryModel.find()
      .populate([
        {
          path: 'employee',
          select: 'name',
        },
        {
          path: 'safe',
          select: 'title',
        },
      ])
      .sort({ createdAt: -1 })
    res.status(200).json({ status: SUCCESS, data: paySalaries })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Pay Salaries'))
  }
}

/*FUNCTIONS*/

async function checkSafeMony(safe, mony) {
  const existingSafe = await SafeModel.findById(safe)
  const existingMony = await MoniesModel.findOne({ safe })
  const safeMony = existingMony?.mony

  if (!existingSafe) {
    return {
      valid: false,
      message: `The Safe Not Found`,
    }
  }
  if (!existingMony) {
    return {
      valid: false,
      message: `The Mony In The Safe (${existingSafe?.title}) is Empty`,
    }
  }
  if (safeMony < parseInt(mony)) {
    return {
      valid: false,
      message: `The Mony Pulled (${mony}) More Mony in The Safe (${existingSafe?.title}) `,
    }
  }
}
