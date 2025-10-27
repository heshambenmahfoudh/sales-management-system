import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import requestIp from 'request-ip'

import authRouter from '../src/routers/usersRouter/authRouter.js'
import usersRouter from '../src/routers/usersRouter/userRouter.js'
import userLogsRouter from '../src/routers/usersRouter/userLogRouter.js'

import homePermissionsRouter from '../src/routers/permissionsRouter/homePermissionRouter.js'
import employeesPermissionsRouter from '../src/routers/permissionsRouter/employeePermissionRouter.js'
import safesPermissionsRouter from '../src/routers/permissionsRouter/safePermissionRouter.js'
import customersPermissionsRouter from '../src/routers/permissionsRouter/customerPermissionRouter.js'
import purchasesPermissionsRouter from '../src/routers/permissionsRouter/purchasePermissionRouter.js'
import settingsPermissionsRouter from '../src/routers/permissionsRouter/settingPermissionRouter.js'
import salesPermissionsRouter from '../src/routers/permissionsRouter/salePermissionRouter.js'
import usersPermissionsRouter from '../src/routers/permissionsRouter/userPermissionRouter.js'
import inventoryPermissionsRouter from '../src/routers/permissionsRouter/inventoryPermissionRouter.js'
import spendablesPermissionsRouter from '../src/routers/permissionsRouter/spendablePermissionRouter.js'
import suppliersPermissionsRouter from '../src/routers/permissionsRouter/supplierPermissionRouter.js'

import productsRouter from '../src/routers/inventoryRouter/productRouter.js'
import brandsRouter from '../src/routers/inventoryRouter/brandRouter.js'
import categoriesRouter from '../src/routers/inventoryRouter/categoryRouter.js'
import unitsRouter from '../src/routers/inventoryRouter/unitRouter.js'
import wareHousesRouter from '../src/routers/inventoryRouter/wareHouseRouter.js'
import productsQtyRouter from '../src/routers/inventoryRouter/productQtyRouter.js'
import damagedProductsRoute from '../src/routers/inventoryRouter/DamagedProductRouter.js'
import transferProductsRoute from '../src/routers/inventoryRouter/TransferProductRouter.js'

import customersRouter from '../src/routers/customersRouter/customerRouter.js'
import customersMonyRouter from '../src/routers/customersRouter/customerMonyRouter.js'

import suppliersRouter from '../src/routers/suppliersRouter/supplierRouter.js'
import suppliersMonyRouter from '../src/routers/suppliersRouter/supplierMonyRouter.js'

import employeesRouter from '../src/routers/employeesAffairsRouter/employeeRouter.js'
import withdrawalsRouter from '../src/routers/employeesAffairsRouter/withdrawalsRouter.js'
import paySalariesRouter from '../src/routers/employeesAffairsRouter/paySalaryRouter.js'

import typeSpendablesRouter from '../src/routers/sependablesRouter/typeSpendableRouter.js'
import spendablesRouter from '../src/routers/sependablesRouter/spendableRouter.js'
import BondReceivablesRouter from '../src/routers/sependablesRouter/BondReceivableRouter.js'
import BondSpendablesRouter from '../src/routers/sependablesRouter/BondSpendableRouter.js'

import safesRouter from '../src/routers/safesRouter/safeRouter.js'
import monyPulledsRouter from '../src/routers/safesRouter/monyPulledRouter.js'
import moniesRouter from '../src/routers/safesRouter/monyRouter.js'
import monyDepositesRouter from '../src/routers/safesRouter/monyDepositeRouter.js'
import transferMonyRouter from '../src/routers/safesRouter/transferMonyRouter.js'

import salesRouter from '../src/routers/salesRouter/saleRouter.js'
import returnsSalesRouter from '../src/routers/salesRouter/returnSaleRouter.js'

import purchasesRouter from '../src/routers/purchasesRouter/purchaseRouter.js'
import returnsPurchasesRouter from '../src/routers/purchasesRouter/returnPurchaseRouter.js'

import settingsRouter from '../src/routers/settingsRouter/settingInvoiceRouter.js'

import { globalErr } from '../src/middleware/errMiddleware.js'
import databaseConnection from './db/db.js'

const app = express()
app.use(cors())
app.use(requestIp.mw())

app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(express.urlencoded({ limit: '50mb', extended: true }))
dotenv.config()

mongoose.set('strictQuery', true)
databaseConnection()

app.use(express.static('public'))

// API END POINT
app.use('/api/v1', authRouter)
app.use('/api/v1', usersRouter)
app.use('/api/v1', userLogsRouter)

app.use('/api/v1', homePermissionsRouter)
app.use('/api/v1', employeesPermissionsRouter)
app.use('/api/v1', safesPermissionsRouter)
app.use('/api/v1', customersPermissionsRouter)
app.use('/api/v1', purchasesPermissionsRouter)
app.use('/api/v1', settingsPermissionsRouter)
app.use('/api/v1', salesPermissionsRouter)
app.use('/api/v1', usersPermissionsRouter)
app.use('/api/v1', inventoryPermissionsRouter)
app.use('/api/v1', spendablesPermissionsRouter)
app.use('/api/v1', suppliersPermissionsRouter)

app.use('/api/v1', productsRouter)
app.use('/api/v1', brandsRouter)
app.use('/api/v1', categoriesRouter)
app.use('/api/v1', unitsRouter)
app.use('/api/v1', wareHousesRouter)
app.use('/api/v1', productsQtyRouter)
app.use('/api/v1', damagedProductsRoute)
app.use('/api/v1', transferProductsRoute)

app.use('/api/v1', customersRouter)
app.use('/api/v1', customersMonyRouter)

app.use('/api/v1', suppliersRouter)
app.use('/api/v1', suppliersMonyRouter)

app.use('/api/v1', employeesRouter)
app.use('/api/v1', withdrawalsRouter)
app.use('/api/v1', paySalariesRouter)

app.use('/api/v1', typeSpendablesRouter)
app.use('/api/v1', spendablesRouter)
app.use('/api/v1', BondReceivablesRouter)
app.use('/api/v1', BondSpendablesRouter)

app.use('/api/v1', safesRouter)
app.use('/api/v1', monyPulledsRouter)
app.use('/api/v1', moniesRouter)
app.use('/api/v1', monyDepositesRouter)
app.use('/api/v1', transferMonyRouter)

app.use('/api/v1', salesRouter)
app.use('/api/v1', returnsSalesRouter)

app.use('/api/v1', purchasesRouter)
app.use('/api/v1', returnsPurchasesRouter)

app.use('/api/v1', settingsRouter)

// HANDLE ERR IN EXPRESS
app.use(globalErr)

// RUN SERVER IN EXPRESS
const server = app.listen(process.env.PORT || 9999, () => {
  console.log(`Starting server running on port (${process.env.PORT ||9999}) :) `)
})

// HANDLE ERR OUT EXPRESS
process.on('unhandledRejection', (err) => {
  console.log(`unhandledRejection err 
    :( => 
    err name : ${err.name}  
    err message : ${err.message}`)
  server.close(() => {
    console.log(`server close`)
    process.exit(1)
  })
})
