'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewSafe(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/safes', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/safes')
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

export async function updateSafe(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/safes/${id}`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/safes')
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


export async function createNewDepositeMony(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/mony-deposites', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/safes/deposits')
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




export async function createNewPulledMony(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post(`/mony-pulleds`, data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/safes/pulled')
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

export async function createNewTransferMony(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/transfers-mony', data)
    if (response.statusText.includes('OK')) {
      revalidatePath('/dashboard/safes/transfers')
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

