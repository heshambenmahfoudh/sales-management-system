'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewProduct(data) {
  try {
     const api = await getApiCreate()
    const response = await api.post('/products', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/products')
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
export async function updateProduct(id, data) {
  try {
     const api = await getApiCreate()
    const response = await api.patch(`/products/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/products')
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
