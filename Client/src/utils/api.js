import Cookies from 'js-cookie'
import {handleAuthError} from './auth'

const BASE_URL = 'https://settystream-production.up.railway.app/api'

export const apiRequest = async ({
  endpoint,
  method = 'GET',
  body = null,
  history,
  isPublic = false,
}) => {
  const token = Cookies.get('token') || localStorage.getItem('token')

  if (!isPublic && !token) {
    handleAuthError(history)
    return null
  }

  try {
    const isFormData = body instanceof FormData

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        ...(isPublic ? {} : {Authorization: `Bearer ${token}`}),
        ...(isFormData ? {} : {'Content-Type': 'application/json'}),
      },
      body: isFormData ? body : body ? JSON.stringify(body) : null,
    })

    if (res.status === 401) {
      handleAuthError(history)
      return null
    }

    let data
    try {
      data = await res.json()
    } catch {
      data = {}
    }

    if (!res.ok || data.success === false) {
      return {
        success: false,
        message:
          data.message || data.error || 'Something went wrong. Please try again.',
      }
    }

    return data
  } catch (error) {
    console.error('❌ Network Error:', error)
    return {
      success: false,
      message: 'Server not reachable. Check internet or backend.',
    }
  }
}
