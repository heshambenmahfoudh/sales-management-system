import SettingInvoiceModel from '../../models/settingsModels/SettingInvoiceModel.js'
import ApiErr from '../../utils/apiErr.js'
import { ERR, SUCCESS } from '../../utils/httpStatus.js'
import { getUserSession } from '../usersService/AuthService.js'
import { createNewUserLog } from '../usersService/UserLogService.js'

// UPDATE CUSTOMER
export async function createNewSettinInvoice(req, res, next) {
  try {
    await SettingInvoiceModel.create({
      shopName: 'Sales System',
      shopAddress: 'yemen-shabwah-alhanak',
      shopPhoneOne: '773057795',
      shopPhoneTwo: '773057795',
      shopterms: 'Sales System',
      imageUrl: 'imageUrl',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Create Setting Invoice'))
  }
}

export async function updateSettingInvoiceById(req, res, next) {
  const { id } = req.params
  const {
    shopName,
    shopAddress,
    shopPhoneOne,
    shopPhoneTwo,
    shopterms,
    imageUrl,
  } = req.body
  try {
    const updatedSettingInvoice = await SettingInvoiceModel.findByIdAndUpdate(
      id,
      {
        $set: {
          shopName,
          shopAddress,
          shopPhoneOne,
          shopPhoneTwo,
          shopterms,
          imageUrl,
        },
      },
      { new: true },
    )
    const session = await getUserSession(req, res, next)
    const userLog = {
      user: session?._id,
      activity: `User (${session?.name}) Updated Setting Invoice Successfully`,
    }
     await createNewUserLog(userLog, req, res, next)
    res.status(200).json({ status: SUCCESS, data: updatedSettingInvoice })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Updated Setting Invoice'))
  }
}

export async function getSettingInvoice(req, res, next) {
  try {
    const settingsInvoice = await SettingInvoiceModel.find()
    res.status(200).json({ status: SUCCESS, data: settingsInvoice?.[0] })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Fetching Setting Invoice'))
  }
}
