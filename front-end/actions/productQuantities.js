'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewProductQty(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/products/products-quantities', data)
    if (response.statusText.includes('OK')) {
        revalidatePath('/dashboard/inventory/products-quantitaies')
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
