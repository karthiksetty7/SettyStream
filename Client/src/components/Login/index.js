import {Component} from 'react'
import Cookies from 'js-cookie'

import {apiRequest} from '../../utils/api'
import logo from '../../SettyStream.png'

import './index.css'

class Login extends Component {
  state = {
    email: '',
    password: '',
    showPasswd: false,
    errMsg: '',
  }

  verifyUserCredientials = async event => {
    event.preventDefault()

    const {email, password} = this.state
    const {history} = this.props

    const data = await apiRequest({
      endpoint: '/auth/login',
      method: 'POST',
      body: {
        email,
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
    const {email, password, showPasswd, errMsg} = this.state

    return (
      <div className='login'>
        <div className='login__card'>
          <img src={logo} alt='website logo' className='login__logo' />

          <form className='login__form' onSubmit={this.verifyUserCredientials}>
            <label htmlFor='email' className='login__label'>
              EMAIL
            </label>
            <input
              id='email'
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={e => this.setState({email: e.target.value})}
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
