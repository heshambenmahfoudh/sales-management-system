'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewSale(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/sales', data)
    if (response.statusText.includes('OK')) {
       revalidatePath('/dashboard/sales')
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



// PURCHASE RETUTN
export async function createNewSaleReturn(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/sales/sales-return', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/sales/return')
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
