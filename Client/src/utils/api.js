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
    if (history) {
      handleAuthError(history)
    }
    return {
      success: false,
      message: 'No token found. Please login again.',
    }
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

    let data = {}
    try {
      data = await res.json()
    } catch (e) {
      data = {}
    }

    if (res.status === 401 && !isPublic) {
      if (history) {
        handleAuthError(history)
      }
      return {
        success: false,
        message: 'Unauthorized. Please login again.',
      }
    }

    if (!res.ok || data.success === false) {
      return {
        success: false,
        message: data.message || 'Something went wrong',
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
