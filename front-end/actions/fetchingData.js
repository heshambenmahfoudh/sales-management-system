'use server'
import { getApiCreate } from './apiCreate'

export async function fetchingData(endPoint) {
  try {
    const api = await getApiCreate()
    const response = await api.get(`/${endPoint}`
  )
    if (response.status === 200) {
      return response?.data?.data
    }
  } catch (error) {
  }
}
