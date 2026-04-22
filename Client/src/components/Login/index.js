import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import {apiRequest} from '../../utils/api'
import logo from '../../SettyStream.png'

import './index.css'

class Login extends Component {
  isMountedFlag = false

  state = {
    loginId: '',
    password: '',
    showPasswd: false,
    errMsg: '',
    isLoading: false,
  }

  componentDidMount() {
    this.isMountedFlag = true
  }

  componentWillUnmount() {
    this.isMountedFlag = false
  }

  setSafeState = updates => {
    if (this.isMountedFlag) {
      this.setState(updates)
    }
  }

  verifyUserCredientials = async event => {
    event.preventDefault()

    const {loginId, password} = this.state
    const {history} = this.props

    this.setSafeState({
      errMsg: '',
      isLoading: true,
    })

    try {
      const data = await apiRequest({
        endpoint: '/auth/login',
        method: 'POST',
        body: {
          loginId,
          password,
        },
        history,
        isPublic: true,
      })

      console.log('LOGIN RESPONSE:', data)

      if (data && data.success) {
        const token =
          data.token ||
          data.jwt_token ||
          data.jwtToken ||
          data.accessToken ||
          ''

        if (!token) {
          this.setSafeState({
            errMsg: 'Login succeeded but token was not returned properly.',
            isLoading: false,
          })
          return
        }

        Cookies.set('jwt_token', token, {expires: 30})
        localStorage.setItem('jwt_token', token)

        const userId =
          data.user_id ||
          data.userId ||
          data.id ||
          data.user?.id ||
          ''

        const username =
          data.username ||
          data.user?.username ||
          data.loginId ||
          ''

        const userName =
          data.name ||
          data.user_name ||
          data.userName ||
          data.user?.name ||
          ''

        if (userId) {
          localStorage.setItem('user_id', userId)
        }

        if (username) {
          localStorage.setItem('username', username)
        }

        if (userName) {
          localStorage.setItem('user_name', userName)
        }

        window.dispatchEvent(new Event('auth-change'))

        if (this.isMountedFlag) {
          history.replace('/')
        }

        return
      }

      this.setSafeState({
        errMsg: data?.message || 'Login failed',
        isLoading: false,
      })
    } catch (error) {
      console.error('LOGIN ERROR:', error)
      this.setSafeState({
        errMsg: 'Something went wrong. Please try again.',
        isLoading: false,
      })
    }
  }

  onChangeLoginId = event => {
    this.setState({loginId: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onToggleShowPassword = event => {
    this.setState({showPasswd: event.target.checked})
  }

  render() {
    const token = Cookies.get('jwt_token') || localStorage.getItem('jwt_token')

    if (token) {
      return <Redirect to="/" />
    }

    const {loginId, password, showPasswd, errMsg, isLoading} = this.state

    return (
      <div className="login">
        <div className="login__card">
          <img src={logo} alt="website logo" className="login__logo" />

          <form className="login__form" onSubmit={this.verifyUserCredientials}>
            <label htmlFor="loginId" className="login__label">
              USERNAME OR EMAIL
            </label>
            <input
              id="loginId"
              type="text"
              placeholder="Enter Username or Email"
              value={loginId}
              onChange={this.onChangeLoginId}
              className="login__input"
            />

            <label htmlFor="password" className="login__label">
              PASSWORD
            </label>
            <input
              id="password"
              type={showPasswd ? 'text' : 'password'}
              placeholder="Enter Password"
              value={password}
              onChange={this.onChangePassword}
              className="login__input"
            />

            <div className="login__checkbox">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPasswd}
                onChange={this.onToggleShowPassword}
              />
              <label htmlFor="showPassword">Show Password</label>
            </div>

            <button type="submit" className="login__btn" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>

            {errMsg && <p className="login__error">{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
