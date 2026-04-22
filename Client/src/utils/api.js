import Cookies from 'js-cookie'
import {handleAuthError} from './auth'

const BASE_URL = 'https://settystream-production.up.railway.app/api'
const TOKEN_KEY = 'jwt_token'
const USER_ID_KEY = 'user_id'
const USERNAME_KEY = 'username'
const USER_NAME_KEY = 'user_name'

const clearAuthStorage = () => {
  Cookies.remove('jwt_token')
  Cookies.remove('token')

  localStorage.removeItem('jwt_token')
  localStorage.removeItem('token')
  localStorage.removeItem(USER_ID_KEY)
  localStorage.removeItem(USERNAME_KEY)
  localStorage.removeItem(USER_NAME_KEY)
}

export const apiRequest = async ({
  endpoint,
  method = 'GET',
  body = null,
  history,
  isPublic = false,
}) => {
  const normalizedEndpoint = endpoint.startsWith('/')
    ? endpoint
    : `/${endpoint}`

  const token =
    Cookies.get('jwt_token') ||
    localStorage.getItem('jwt_token') ||
    Cookies.get('token') ||
    localStorage.getItem('token')

  if (!isPublic && !token) {
    clearAuthStorage()

    if (history) {
      handleAuthError(history)
    }

    window.dispatchEvent(new Event('auth-change'))

    return {
      success: false,
      message: 'No token found. Please login again.',
    }
  }

  try {
    const isFormData = body instanceof FormData

    const res = await fetch(`${BASE_URL}${normalizedEndpoint}`, {
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
      clearAuthStorage()

      if (history) {
        handleAuthError(history)
      }

      window.dispatchEvent(new Event('auth-change'))

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
    console.error('Network Error:', error)
    return {
      success: false,
      message: 'Server not reachable. Check internet or backend.',
    }
  }
}
