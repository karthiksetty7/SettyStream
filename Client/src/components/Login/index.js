import {Component} from 'react'
import Cookies from 'js-cookie'
import {apiRequest} from '../../utils/api'

import logo from '../../SettyStream.png'
import './index.css'

class Login extends Component {
  state = {
    loginId: '',
    password: '',
    showPasswd: false,
    errMsg: '',
  }

  verifyUserCredientials = async event => {
    event.preventDefault()

    const {loginId, password} = this.state
    const {history} = this.props

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
      history.replace('/')
    } else {
      this.setState({errMsg: data?.message || 'Login failed'})
    }
  }

  render() {
    const {loginId, password, showPasswd, errMsg} = this.state

    return (
      <div className='login'>
        <div className='login__card'>
          <img src={logo} alt='website logo' className='login__logo' />

          <form className='login__form' onSubmit={this.verifyUserCredientials}>
            <label htmlFor='loginId' className='login__label'>
              USERNAME OR EMAIL
            </label>
            <input
              id='loginId'
              type='text'
              placeholder='Enter Username or Email'
              value={loginId}
              onChange={e => this.setState({loginId: e.target.value})}
              className='login__input'
            />

            <label htmlFor='password' className='login__label'>
              PASSWORD
            </label>
            <input
              id='password'
              type={showPasswd ? 'text' : 'password'}
              placeholder='Enter Password'
              value={password}
              onChange={e => this.setState({password: e.target.value})}
              className='login__input'
            />

            <div className='login__checkbox'>
              <input
                id='showPassword'
                type='checkbox'
                onChange={e => this.setState({showPasswd: e.target.checked})}
              />
              <label htmlFor='showPassword'>Show Password</label>
            </div>

            <button type='submit' className='login__btn'>
              Login
            </button>

            {errMsg && <p className='login__error'>{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
