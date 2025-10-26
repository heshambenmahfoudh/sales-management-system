import ApiErr from '../../utils/apiErr.js'
import { bcryptPassword, comparePassword } from '../../utils/bcryptPassword.js'
import {
  generateAccessToken,
  generateRefrechToken,
} from '../../utils/generateJWT.js'
import jwt from 'jsonwebtoken'
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
import { SUCCESS, FAIL, ERR } from '../../utils/httpStatus.js'
import UserAccessTokenModel from '../../models/usersModels/UserAccessTokenModel.js'
import UserRefreshTokenModel from '../../models/usersModels/UserRefreshTokenModel.js'
import { createNewSettinInvoice } from '../settingsService/SettingInvoiceService.js'
import { createNewUserLog } from './UserLogService.js'

export async function createAccount(req, res, next) {
  const { name, email, password, imageUrl, role } = req.body

  try {
    const check = await checkExistingUser(name, email)
    if (check?.valid === false) {
      return next(new ApiErr(FAIL, 403, check?.message))
    }

    const newUser = await UserModel.create({
      name,
      email,
      imageUrl,
      role,
      password: await bcryptPassword(password),
    })

    if (role?.includes('ADMIN')) {
      await createAdminPermission(newUser?._id)
    } else {
      await createUserPermission(newUser?._id)
    }

    const savedUser = await newUser.save()
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Created New user (${newUser?.name}) Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: savedUser })
  } catch (err) {
    return next(new ApiErr(ERR, 500, `Failed to Create User `))
  }
}

export async function loginUser(req, res, next) {
  const { email, password } = req.body

  const passwordBody = password
  const { role } = req.query
  const existingUserAdmin = await UserModel.findOne({
    role,
  })
  if (role && !existingUserAdmin) {
    await createNewAdmin(email, password, role, req, res, next)
    return
  }

  try {
    const existingUser = await UserModel.findOne({
      email,
    })

    if (!existingUser) {
      return next(new ApiErr(FAIL, 404, `User (${email}) Not Found `))
    }
    const hashPassword = await comparePassword(
      passwordBody,
      existingUser.password,
    )

    if (!hashPassword) {
      return next(new ApiErr(FAIL, 403, `Wrong password or username`))
    }

    const userId = existingUser._id
    const accessToken = await generateUserAccessToken(userId)
    const refrechToken = await generateUserRefrechToken(userId)
    const userLog = {
      user: userId,
      activity: `User (${existingUser?.name}) Logged in Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ accessToken, refrechToken })
  } catch (err) {
    return next(new ApiErr(ERR, 500, `Failed To Login User `))
  }
}

export async function getServerUser(req, res, next) {
  try {
    const authToken = req.headers['auth-token']
    const token = JSON.parse(authToken)
    const { accessToken, refrechToken } = token
    if (!accessToken && !refrechToken) {
      return next(new ApiErr(FAIL, 402, `User session not vaild `))
    }

    let sessionIdToken = ''
    let sessionId = ''
    if (accessToken && accessToken !== 'EXPIRED') {
      sessionIdToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN)
      sessionId = await UserAccessTokenModel.findOne({
        sessionId: sessionIdToken,
      })
    } else {
      sessionIdToken = jwt.verify(refrechToken, process.env.REFRECH_TOKEN)
      sessionId = await UserRefreshTokenModel.findOne({
        sessionId: sessionIdToken,
      })
    }

    const id = sessionId?.userId?.toString()
    const existingUser = await UserModel.findById(id)

    const {
      password,
      createdAt,
      updatedAt,
      __v,
      ...userWithoutPassword
    } = existingUser?._doc

    res.status(200).json({
      userWithoutPassword,
    })
  } catch (err) {
    return next(new ApiErr(ERR, 500, `Failed To Get server user `))
  }
}

export async function getUserSession(req, res, next) {
  try {
    const authToken = req.headers['auth-token']
    const token = JSON.parse(authToken)
    const { accessToken, refrechToken } = token

    let sessionIdToken = ''
    let sessionId = ''
    if (accessToken && accessToken !== 'EXPIRED') {
      sessionIdToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN)
      sessionId = await UserAccessTokenModel.findOne({
        sessionId: sessionIdToken,
      })
    } else {
      sessionIdToken = jwt.verify(refrechToken, process.env.REFRECH_TOKEN)
      sessionId = await UserRefreshTokenModel.findOne({
        sessionId: sessionIdToken,
      })
    }

    const id = sessionId?.userId?.toString()
    const existingUser = await UserModel.findById(id)

    const {
      password,
      createdAt,
      updatedAt,
      __v,
      ...userWithoutPassword
    } = existingUser?._doc

    return userWithoutPassword
  } catch (err) {}
}

export async function setServerUser(req, res, next) {
  try {
    const authToken = req.headers['auth-token']
    const token = JSON.parse(authToken)
    const { refrechToken } = token

    const sessionIdToken = jwt.verify(refrechToken, process.env.REFRECH_TOKEN)
    const sessionId = await UserRefreshTokenModel.findOne({
      sessionId: sessionIdToken,
    })
    const userId = sessionId?.userId?.toString()
    await UserAccessTokenModel.deleteOne({ userId })
    const accessToken = await generateUserAccessToken(userId)
    res.status(200).json({ accessToken })
  } catch (err) {
    return next(new ApiErr(ERR, 500, `Failed To set server user `))
  }
}

export async function logoutUser(req, res, next) {
  try {
    const authToken = req.headers['auth-token']
    const token = JSON.parse(authToken)
    const { refrechToken } = token

    const sessionId = jwt.verify(refrechToken, process.env.REFRECH_TOKEN)
    const existingUser = await UserRefreshTokenModel.findOne({ sessionId })
    const userId = existingUser?.userId
    const exist = await UserModel.findById(userId)
    await UserAccessTokenModel.deleteOne({
      userId,
    })
    await UserRefreshTokenModel.deleteOne({
      userId,
    })
    const userLog = {
      user: exist?._id,
      activity: `User (${exist?.name}) Logout Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res
      .status(200)
      .json({ status: SUCCESS, message: 'User logout successfully' })
  } catch (err) {
    return next(new ApiErr(ERR, 500, `Failed to Logout User `))
  }
}

/* FUNCTION */

async function createAdminPermission(user) {
  try {
    await HomePermissionModel.create({
      user,
      homeDisplay: true,
      logDisplay: true,
      logDelete: true,
    })
    await SettingPermissionModel.create({
      user,
      SettingInvoiceData: true,
      SettingProfileData: true,
    })
    await UserPermissionModel.create({
      user,
      userDataDisplay: true,
      userDataCreate: true,
      userDataUpdate: true,
      userDataDelete: true,
      userPermissionDisplay: true,
      userPermissionCreate: true,
      userPermissionUpdate: true,
      userPermissionDelete: true,
    })
    await InventoryPermissionModel.create({
      user,
      productsDataDisplay: true,
      productsDataCreate: true,
      productsDataUpdate: true,
      productsDataDelete: true,

      categoriesDataDisplay: true,
      categoriesDataCreate: true,
      categoriesDataUpdate: true,
      categoriesDataDelete: true,

      brandsDataDisplay: true,
      brandsDataCreate: true,
      brandsDataUpdate: true,
      brandsDataDelete: true,

      unitsDataDisplay: true,
      unitsDataCreate: true,
      unitsDataUpdate: true,
      unitsDataDelete: true,

      wareHousesDataDisplay: true,
      wareHousesDataCreate: true,
      wareHousesDataUpdate: true,
      wareHousesDataDelete: true,

      productsQuantitaesDataDisplay: true,
      productsQuantitaesDataCreate: true,
      productsQuantitaesDataDelete: true,

      productsTransfersDataDisplay: true,
      productsTransfersDataCreate: true,
      productsTransfersDataView: true,
      productsTransfersDataDelete: true,

      productsDamagedDataDisplay: true,
      productsDamagedDataCreate: true,
      productsDamagedDataView: true,
      productsDamagedDataDelete: true,
    })
    await SpendablePermissionModel.create({
      user,
      typeSpendablesDataDisplay: true,
      typeSpendablesDataCreate: true,
      typeSpendablesDataUpdate: true,
      typeSpendablesDataDelete: true,

      spendablesDataDisplay: true,
      spendablesDataCreate: true,
      spendablesDataView: true,
      spendablesDataDelete: true,

      bondsSpendablesDataDisplay: true,
      bondsSpendablesDataCreate: true,
      bondsSpendablesDataView: true,
      bondsSpendablesDataDelete: true,
      bondsSpendablesDataViewInvoice: true,

      bondsReceivablesDataDisplay: true,
      bondsReceivablesDataCreate: true,
      bondsReceivablesDataView: true,
      bondsReceivablesDataDelete: true,
      bondsReceivablesDataViewInvoice: true,
    })
    await SupplierPermissionModel.create({
      user,
      suppliersDataDisplay: true,
      suppliersDataCreate: true,
      suppliersDataUpdate: true,
      suppliersDataDelete: true,

      suppliersPaidDisplay: true,
      suppliersPaidUpdate: true,
      suppliersPaidDelete: true,

      suppliersDelayedDisplay: true,
      suppliersDelayedUpdate: true,
      suppliersDelayedDelete: true,
    })
    await CustomerPermissionModel.create({
      user,
      customersDataDisplay: true,
      customersDataCreate: true,
      customersDataUpdate: true,
      customersDataDelete: true,

      customersPaidDisplay: true,
      customersPaidUpdate: true,
      customersPaidDelete: true,

      customersDelayedDisplay: true,
      customersDelayedUpdate: true,
      customersDelayedDelete: true,
    })
    await EmployeePermissionModel.create({
      user,
      employeesDataDisplay: true,
      employeesDataCreate: true,
      employeesDataUpdate: true,
      employeesDataDelete: true,

      employeesWithdrawalsDataDisplay: true,
      employeesWithdrawalsDataCreate: true,
      employeesWithdrawalsDataView: true,
      employeesWithdrawalsDataDelete: true,

      employeesPaySalaryDataDisplay: true,
      employeesPaySalaryDataCreate: true,
      employeesPaySalaryDataView: true,
      employeesPaySalaryDataDelete: true,
    })
    await SafePermissionModel.create({
      user,
      safesDataDisplay: true,
      safesDataCreate: true,
      safesDataUpdate: true,
      safesDataDelete: true,

      safesDepositsDisplay: true,
      safesDepositsCreate: true,
      safesDepositsView: true,
      safesDepositsDelete: true,

      safesPulledDisplay: true,
      safesPulledCreate: true,
      safesPulledView: true,
      safesPulledDelete: true,

      safesTransfersDisplay: true,
      safesTransfersCreate: true,
      safesTransfersView: true,
      safesTransfersDelete: true,

      safesMonyDisplay: true,
      safesMonyDelete: true,
    })
    await PurchasePermissionModel.create({
      user,
      purchasesDataDisplay: true,
      purchasesDataCreate: true,
      purchasesDataUpdate: true,
      purchasesDataDelete: true,
      purchasesDataViewInvoice: true,

      purchasesReturnDisplay: true,
      purchasesReturnCreate: true,
      purchasesReturnUpdate: true,
      purchasesReturnDelete: true,
      purchasesReturnViewInvoice: true,
    })
    await SalePermissionModel.create({
      user,
      salesDataDisplay: true,
      salesDataCreate: true,
      salesDataUpdate: true,
      salesDataDelete: true,
      salesDataViewInvoice: true,

      salesReturnDisplay: true,
      salesReturnCreate: true,
      salesReturnUpdate: true,
      salesReturnDelete: true,
      salesReturnViewInvoice: true,

      salesEarningDisplay: true,
      salesEarningDelete: true,
      salesEarningInvoice: true,
    })
  } catch (err) {}
}

async function createUserPermission(user) {
  try {
    await HomePermissionModel.create({
      user,
    })
    await SettingPermissionModel.create({
      user,
    })
    await UserPermissionModel.create({
      user,
    })
    await InventoryPermissionModel.create({
      user,
    })
    await SpendablePermissionModel.create({
      user,
    })
    await SupplierPermissionModel.create({
      user,
    })
    await CustomerPermissionModel.create({
      user,
    })
    await EmployeePermissionModel.create({
      user,
    })
    await SafePermissionModel.create({
      user,
    })
    await PurchasePermissionModel.create({
      user,
    })
    await SalePermissionModel.create({
      user,
    })
  } catch (err) {}
}

async function createNewAdmin(email, password, role, req, res, next) {
  try {
    const newUserAdmin = await UserModel.create({
      email,
      name: 'super admin',
      imageUrl: 'imageUrl',
      role,
      password: await bcryptPassword(password),
    })
    await createAdminPermission(newUserAdmin?._id)
    await newUserAdmin.save()
    const userId = newUserAdmin._id
    const accessToken = await generateUserAccessToken(userId)
    const refrechToken = await generateUserRefrechToken(userId)

    await createNewSettinInvoice()

    const userLog = {
      user: newUserAdmin?._id,
      activity: `User (${newUserAdmin?.name}) Logged in Successfully`,
    }
    await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ accessToken, refrechToken })
  } catch (err) {
    console.log(err)
    return next(new ApiErr(ERR, 500, `Failed To Create New User Admin `))
  }
}

async function checkExistingUser(name, email) {
  try {
    const oldUserName = await UserModel.findOne({ name })
    if (oldUserName) {
      return {
        valid: false,
        message: `User (${name}) Alredy Created `,
      }
    }
    const oldUserEmail = await UserModel.findOne({ email })
    if (oldUserEmail) {
      return {
        valid: false,
        message: `User (${email}) Alredy Created `,
      }
    }
  } catch (error) {}
}

export async function generateUserAccessToken(userId) {
  try {
    const sessionId = crypto.randomUUID()
    const accessToken = await generateAccessToken(sessionId)
    await UserAccessTokenModel.deleteOne({ userId })
    const newAccessToken = await UserAccessTokenModel.create({
      sessionId,
      userId,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000),
    })

    await newAccessToken.save()

    return accessToken
  } catch (error) {}
}

export async function generateUserRefrechToken(userId) {
  try {
    const sessionId = crypto.randomUUID()
    const refrechToken = await generateRefrechToken(sessionId)
    await UserRefreshTokenModel.deleteOne({ userId })
    const newRefrechToken = await UserRefreshTokenModel.create({
      sessionId,
      userId,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    })
    await newRefrechToken.save()
    return refrechToken
  } catch (error) {}
}
