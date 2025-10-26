'use server'
import { getApiCreate } from './apiCreate'
import { getServerUser } from './auth'

export async function deleteItem(endPoint, id) {
  try {
    const session = await getServerUser()
    const userId = session?.id
    if (id === userId) {
      return {
        status: 401,
        error: "Wrong can't delete your self",
      }
    }
    const api = await getApiCreate()
    const response = await api.delete(`/${endPoint}/${id}`)
    if (response.status === 200) {
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
