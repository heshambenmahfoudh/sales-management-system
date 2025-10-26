'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewCustomer(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/customers', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/customers')
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

export async function updateCustomer(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/customers/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/customers')
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

export async function updateCustomerMonyDelay(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/customers/customers-mony/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/customers/customers-delayed')
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
