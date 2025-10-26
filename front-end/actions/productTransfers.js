'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewTransferProduct(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/products/transfer-products', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/inventory/products-transfers')
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
