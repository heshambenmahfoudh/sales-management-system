'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewUnit(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/units', data)
    if (response.statusText.includes('OK')) {
       revalidatePath('/dashboard/inventory/units')
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

export async function updateUnit(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/units/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/units')
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
