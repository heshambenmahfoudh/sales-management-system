'use server'
import axios from 'axios'
import { cookies } from 'next/headers'
const baseURL = process.env.NEXT_PUBLIC_BASE_URL
async function getTokins() {
  try {
    const cookieStore = await cookies()
    let accessToken = cookieStore.get('accessToken')?.value
    let refrechToken = cookieStore.get('refrechToken')?.value
    if (!accessToken) {
      accessToken = 'EXPIRED'
    }
    if (!refrechToken) {
      refrechToken = 'EXPIRED'
    }
    const token = {
      accessToken,
      refrechToken,
    }
    return token
  } catch (error) {
    console.log(error)
  }
}
export async function getApiCreate() {
  try {
    const token = await getTokins()
    const api = axios.create({
      baseURL,
      withCredentials: true,
      headers: {
        'auth-token': JSON.stringify(token),
      },
    })
    
    return api
  } catch (error) {
    console.log(error)
  }
}

