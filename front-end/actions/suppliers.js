'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewSupplier(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/suppliers', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/suppliers')
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

export async function updateSupplier(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/suppliers/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/suppliers')
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

export async function updateSupplierMonyDelay(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/suppliers/suppliers-mony/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/suppliers/suppliers-delayed')
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
