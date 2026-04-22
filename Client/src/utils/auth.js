import Cookies from 'js-cookie'

export const handleAuthError = history => {
  alert('Session expired. Please login again.')

  Cookies.remove('token')
  Cookies.remove('jwt_token')

  localStorage.removeItem('token')
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('user_id')
  localStorage.removeItem('username')
  localStorage.removeItem('user_name')

  window.dispatchEvent(new Event('auth-change'))

  if (history && history.replace) {
    history.replace('/login')
  }
}
