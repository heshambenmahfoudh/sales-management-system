'use server'
import { revalidatePath } from 'next/cache'
import { getApiCreate } from './apiCreate'

export async function createNewEmployee(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/employees', data)
    if (response.statusText.includes('OK')) {
       revalidatePath('/dashboard/employees')
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

export async function updateEmployee(id, data) {
  try {
    const api = await getApiCreate()
    const response = await api.patch(`/employees/${id}`, data)
    if (response.statusText.includes('OK')) {
       revalidatePath('/dashboard/employees')
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

// EMPLOYEE WITHDRAWLS
export async function createNewEmployeeWithdrawls(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/employees/withdrawals', data)
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

// EMPLOYEE PAY SALARY
export async function createNewPaySalaryEmployee(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/employees/pay-salaries', data)
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
