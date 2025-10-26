import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import ApiErr from '../../utils/apiErr.js'
import { bcryptPassword } from '../../utils/bcryptPassword.js'
import UserPermissionModel from '../../models/permissionsModels/UserPermissionModel.js'
import SettingPermissionModel from '../../models/permissionsModels/SettingPermissionModel.js'
import HomePermissionModel from '../../models/permissionsModels/HomePermissionModel.js'
import InventoryPermissionModel from '../../models/permissionsModels/InventoryPermissionModel.js'
import SpendablePermissionModel from '../../models/permissionsModels/SpendablePermissionModel.js'
import SupplierPermissionModel from '../../models/permissionsModels/SupplierPermissionModel.js'
import CustomerPermissionModel from '../../models/permissionsModels/CustomerPermissionModel.js'
import EmployeePermissionModel from '../../models/permissionsModels/EmployeePermissionModel.js'
import SafePermissionModel from '../../models/permissionsModels/SafePermissionModel.js'
import PurchasePermissionModel from '../../models/permissionsModels/PurchasePermissionModel.js'
import SalePermissionModel from '../../models/permissionsModels/SalePermissionModel.js'
import UserModel from '../../models/usersModels/UserModel.js'
import {
  generateUserAccessToken,
  generateUserRefrechToken,
  getUserSession,
} from './AuthService.js'
import { createNewUserLog } from './UserLogService.js'

export async function updatedUserById(req, res, next) {
  const { name, email, password, imageUrl, role } = req.body
  const { id } = req.params

  try {
    const existingUser = await UserModel.findById(id)
    if (!existingUser) {
      return next(new ApiErr(FAIL, 403, 'User not found'))
    }
    let newPassword = ''
    if (password !== '***************') {
      newPassword = await bcryptPassword(password)
    } else {
      newPassword = existingUser.password
    }
    await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { name, email, imageUrl, password: newPassword, role },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated User (${name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json(true)
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated User '))
  }
}

export async function updatedUserprofileById(req, res, next) {
  const { name, email, password, imageUrl, role } = req.body
  const { id } = req.params

  try {
    await UserModel.findByIdAndUpdate(
      id,
      {
        $set: { name, email, imageUrl, role },
      },
      { new: true },
    )

    const existingUser = await UserModel.findById(id)
    if (password && password !== '***************') {
      await UserModel.findByIdAndUpdate(
        id,
        {
          $set: {
            password: await bcryptPassword(password),
          },
        },
        { new: true },
      )
    }
    const userId = existingUser._id
    const accessToken = await generateUserAccessToken(userId)
    const refrechToken = await generateUserRefrechToken(userId)
    const userLog = {
      user: id,
      activity: `User (${existingUser?.name}) Updated User Profile Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ accessToken, refrechToken })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated User '))
  }
}

export async function getUserById(req, res, next) {
  const { id } = req.params
  const { email } = req.query

  try {
    const existingUser = id
      ? await UserModel.findById(id)
      : await UserModel.find({ email })

    if (!existingUser) {
      return next(new ApiErr(FAIL, 402, 'User Not Found'))
    }
    const { password, ...userWithoutPassword } = existingUser._doc

    res.status(200).json({ status: SUCCESS, data: userWithoutPassword })
  } catch (err) {
    next(new ApiErr(ERR, 402, 'Failed to Fetching User'))
  }
}

export async function deleteUserById(req, res, next) {
  const { id } = req.params

  try {
    const exist = await UserModel.findById(id)
    await UserModel.findByIdAndDelete(id)
    await deletePermissionOfUser(id)
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Deleted User (${exist?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, message: 'User has ben Deleted ' })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted User'))
  }
}

export async function getAllUsers(req, res, next) {
  const { session } = req.query
  try {
    const users = await UserModel.find({ _id: { $ne: session } }).sort({
      role: 1,
    })
    if (!users) {
      next(new ApiErr(FAIL, 402, 'Users Not Found'))
      return
    }

    res.status(200).json({ status: SUCCESS, data: users })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Users'))
  }
}

async function deletePermissionOfUser(id) {
  try {
    await HomePermissionModel.deleteOne({ user: id })
    await SettingPermissionModel.deleteOne({ user: id })
    await UserPermissionModel.deleteOne({ user: id })
    await InventoryPermissionModel.deleteOne({ user: id })
    await SpendablePermissionModel.deleteOne({ user: id })
    await SupplierPermissionModel.deleteOne({ user: id })
    await CustomerPermissionModel.deleteOne({ user: id })
    await EmployeePermissionModel.deleteOne({ user: id })
    await SafePermissionModel.deleteOne({ user: id })
    await PurchasePermissionModel.deleteOne({ user: id })
    await SalePermissionModel.deleteOne({ user: id })
  } catch (err) {}
}
