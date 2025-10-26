import { UAParser } from 'ua-parser-js'
import UserLogModel from '../../models/usersModels/UserLogModel.js'
import { ERR, SUCCESS } from '../../utils/httpStatus.js'
import ApiErr from '../../utils/apiErr.js'

export async function createNewUserLog(formData, req, res, next) {
  const { user, activity } = formData

  try {
    const data = await informationData(req, res, next)
    await UserLogModel.create({
      user,
      activity,
      ipAdress: data?.ipAdress,
      device: data?.device,
    })
    await newUserLog.save()
  } catch (error) {}
}

export async function getUserLogs(req, res, next) {
  try {
    const userLogsData = await UserLogModel.find()
      .populate([{ path: 'user', select: '_id name' }])
      .sort({ createdAt: -1 })

    const groupedDate = userLogsData?.reduce((acc, log) => {
      const date = log?.createdAt?.toString()?.slice(0, 15)
      if (!acc[date]) {
        acc[date] = []
      }
      acc[date]?.push(log)
      return acc
    }, {})
    const usersLogs = Object.entries(groupedDate).map(
      ([logDate, userLogs]) => ({
        logDate,
        userLogs,
      }),
    )
    res
      .status(200)
      .json({
        status: SUCCESS,
        data: { logs:usersLogs, length: userLogsData?.length },
      })
  } catch (error) {
    next(new ApiErr(ERR, 500, 'Failed to fetching users logs'))
  }
}

export async function deleteUserLogById(req, res, next) {
  const { id } = req.params
  try {
    await UserLogModel.findByIdAndDelete(id)
    res.status(200).json({
      status: SUCCESS,
      message: 'User Log has been Deleted',
    })
  } catch (err) {
    next(new ApiErr(ERR, 500, 'Failed to Deleted User Log'))
  }
}

async function informationData(req, res, next) {
  try {
    const userAgent = await req.headers['user-agent']
    const parser = new UAParser(userAgent)
    const result = await parser.getResult()
    const device = (await result.device.type) || 'Desktop'
    const ipAdress = req.clientIp
    return {
      ipAdress,
      device,
    }
  } catch {}
}
