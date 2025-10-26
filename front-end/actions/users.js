'use server'
import { revalidatePath } from 'next/cache'
import { createNewServerSession } from './auth'
import { getApiCreate } from './apiCreate'

export async function createNewUser(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/auth/register', data)
    revalidatePath('/dashboard/users')
    if (response.statusText.includes('OK')) {
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

export async function updateUser(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/users/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/users')
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

export async function updateUserProfile(id, data) {
  try {
   
    const api = await getApiCreate()
    const response = await api.patch(`/users/user-profile/${id}`, data)
    if (response.status === 200) {
      const { accessToken, refrechToken } = response.data
      const { success } = await createNewServerSession(
        accessToken,
        refrechToken,
      )
      revalidatePath('/dashboard/settings/setting-profile/update')
      if (success) {
        return {
          status: 200,
          error: null,
        }
      }
    }
  } catch (error) {
    return {
      status: 500,
      error: error?.response?.data?.message,
    }
  }
}
