'use server'
import { revalidateTag } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function updateUserPermission(endPoint, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(endPoint, data)
    if (response.statusText.includes('OK')) {
      revalidateTag('/dashboard')
      return {
        status: 200,
        error: null,
      }
    }
  } catch (error) {
    return {
      status: 500,
      error: error?.response?.data?.message,
    }
  }
}

export async function fetchingPermissionData(endPoint) {
  try {
    const api = await getApiCreate()
    const response = await api.get(`/${endPoint}`)
    if (response.status === 200) {
      return response?.data?.data
    }
  } catch (error) {
    return error?.response?.data?.message
  }
}

