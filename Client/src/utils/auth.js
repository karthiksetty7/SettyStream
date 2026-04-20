import Cookies from 'js-cookie'

export const handleAuthError = history => {
  alert('Session expired. Please login again.')
  localStorage.removeItem('token')
  Cookies.remove('token')
  history.replace('/login')
}
