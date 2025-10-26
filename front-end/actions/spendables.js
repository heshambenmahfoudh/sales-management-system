'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewTypeSpendable(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/type-spendables', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/spendables/type-spendables')
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

export async function updateTypeSpendable(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/type-spendables/${id}`, data)
    revalidatePath('/dashboard/spendables/type-spendables')
    if (response.statusText.includes('OK')) {
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

export async function createNewSpendable(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/spendables', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/spendables')
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


// BOND SPENDABLE FROM THE SAFE
export async function createNewBondSpendable(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/spendables/bonds-spendables', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/spendables/bonds-spendables')
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

// BOND RECIVABLE FROM THE SAFE
export async function createNewBondRecivable(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/spendables/bonds-receivables', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/spendables/bonds-recivables')
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
