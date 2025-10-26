import EmployeePermissionModel from "../../models/permissionsModels/EmployeePermissionModel.js"
import UserModel from "../../models/usersModels/UserModel.js"
import ApiErr from "../../utils/apiErr.js"
import { ERR, SUCCESS,FAIL } from "../../utils/httpStatus.js"
import { getUserSession } from "../usersService/AuthService.js"
import { createNewUserLog } from "../usersService/UserLogService.js"


// UPDATED USER
export async function updatedEmployeePermissionById(req, res, next){
  const { id: user } = req.params
  const {
    employeesDataDisplay,
    employeesDataCreate,
    employeesDataUpdate,
    employeesDataDelete,

    employeesWithdrawalsDataDisplay,
    employeesWithdrawalsDataCreate,
    employeesWithdrawalsDataView,
    employeesWithdrawalsDataDelete,

    employeesPaySalaryDataDisplay,
    employeesPaySalaryDataCreate,
    employeesPaySalaryDataView,
    employeesPaySalaryDataDelete,
  } = req.body

  
  try {
    const updateEmployeePermission = await EmployeePermissionModel.updateOne(
      {user},
      {
        $set: {
          employeesDataDisplay,
          employeesDataCreate,
          employeesDataUpdate,
          employeesDataDelete,

          employeesWithdrawalsDataDisplay,
          employeesWithdrawalsDataCreate,
          employeesWithdrawalsDataView,
          employeesWithdrawalsDataDelete,

          employeesPaySalaryDataDisplay,
          employeesPaySalaryDataCreate,
          employeesPaySalaryDataView,
          employeesPaySalaryDataDelete,
        },
      },
      { new: true },
    )
  const session = await getUserSession(req, res, next)
    const existing = await UserModel.findById(user)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Employees Permission of user (${existing?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ success: SUCCESS, data: updateEmployeePermission })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Employee Permission '))
  }
}

export async function getEmployeePermissionByQuery(req, res, next){
  const { email, user } = req.query

  try {
   
    const existingEmployeePermission = await EmployeePermissionModel.findOne({
      user,
    })
   
    if (!existingEmployeePermission) {
      return next(new ApiErr(FAIL, 402, 'Employee Permission Not Found'))
    }
    res.status(200).json({ status: SUCCESS, data: existingEmployeePermission })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching Employee Permission'))
  }
}
