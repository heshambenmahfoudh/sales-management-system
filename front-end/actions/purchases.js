'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewPurchase(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/purchases', data)
    if (response.statusText.includes('OK')) {
       revalidatePath('/dashboard/purchases')
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
export async function createNewPurchaseReturn(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/purchases/purchases-return', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/purchases/return')
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