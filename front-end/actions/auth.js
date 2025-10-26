'use server'
import { cookies } from 'next/headers'
import { getApiCreate } from './apiCreate'

export async function loginUser(data) {
  try {
    const api = await getApiCreate()
    const response = await api.post('/auth/login?role=ADMIN', data)
    if (response.statusText.includes('OK')) {
      const { accessToken, refrechToken } = response.data
       await createNewServerSession(
        accessToken,
        refrechToken,
      )
      return {
        status: 200,
        error: null,
      }
    }
  } catch (error) {
    console.log(error)
    console.log(error?.response)
    return {
      status: 500,
      error: error?.response?.data?.message,
    }
  }
}

export async function createNewServerSession(accessToken, refrechToken) {
  try {
    const cookieStore = await cookies()
    cookieStore?.set('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 2, // 60 minutes
      path: '/',
    })
    cookieStore.set('refrechToken', refrechToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Invalid data' }
  }
}

export async function getServerUser() {
  try {
    const api = await getApiCreate()
    const response = await api.get(`/auth/server-user`)

    if (response.status === 200) {
      const { _id, name, email, imageUrl ,role } = response.data.userWithoutPassword

      const data = {
        id: _id,
        name: name,
        email: email,
        imageUrl: imageUrl,
        role: role,
      }
      return data
    }
  } catch (error) {
    return null
  }
}

export async function logoutUser() {
  try {
    const api = await getApiCreate()
    const response = await api.delete('/auth/logout-user')
    if (response.status === 200) {
      const cookiesStore = await cookies()
      cookiesStore.delete({ name: 'accessToken', path: '/' })
      cookiesStore.delete({ name: 'refrechToken', path: '/' })
      return {
        message: 'User Logout successfully',
        status: 200,
        error: null,
      }
    }
  } catch (error) {
    return {
      data: null,
      status: 500,
      error: 'Faild to Logout user',
    }
  }
}
