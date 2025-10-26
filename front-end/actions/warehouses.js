'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewWarehouse(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/warehouses', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/warehouses')
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

export async function updateWarehouse(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/warehouses/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/warehouses')
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
