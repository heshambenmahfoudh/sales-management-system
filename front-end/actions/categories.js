'use server'

import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewCategory(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/categories', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/categories')
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

export async function updateCategory(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/categories/${id}`, data)
    if (response.statusText.includes('OK')) {
       revalidatePath('/dashboard/inventory/categories')
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
