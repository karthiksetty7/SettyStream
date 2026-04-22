import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import {apiRequest} from '../../utils/api'
import logo from '../../SettyStream.png'

import './index.css'

class Login extends Component {
  state = {
    loginId: '',
    password: '',
    showPasswd: false,
    errMsg: '',
    isLoading: false,
  }

  verifyUserCredientials = async event => {
    event.preventDefault()

    const {loginId, password} = this.state
    const {history} = this.props

    this.setState({
      errMsg: '',
      isLoading: true,
    })

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

    if (data && data.success) {
      Cookies.set('token', data.token, {expires: 30})
      localStorage.setItem('token', data.token)

      if (data.user_id) {
        localStorage.setItem('user_id', data.user_id)
      } else if (data.id) {
        localStorage.setItem('user_id', data.id)
      }

      if (data.username) {
        localStorage.setItem('username', data.username)
      }

      if (data.name) {
        localStorage.setItem('user_name', data.name)
      }

      window.dispatchEvent(new Event('auth-change'))
      history.replace('/')
    } else {
      this.setState({errMsg: data?.message || 'Login failed'})
    }

    this.setState({isLoading: false})
  }

  render() {
    const token = Cookies.get('token') || localStorage.getItem('token')

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
              onChange={e => this.setState({loginId: e.target.value})}
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
              onChange={e => this.setState({password: e.target.value})}
              className="login__input"
            />

            <div className="login__checkbox">
              <input
                id="showPassword"
                type="checkbox"
                checked={showPasswd}
                onChange={e => this.setState({showPasswd: e.target.checked})}
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
