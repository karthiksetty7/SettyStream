import {Component} from 'react'
import Cookies from 'js-cookie'

import logo from '../../SettyStream.png'

import './index.css'

class Login extends Component {
  state = {
    userName: '',
    passWord: '',
    showPasswd: false,
    errMsg: '',
  }

  verifyUserCredientials = async event => {
    event.preventDefault()

    const {userName, passWord} = this.state

    const response = await fetch('https://apis.ccbp.in/login', {
      method: 'POST',
      body: JSON.stringify({
        username: userName,
        password: passWord,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      Cookies.set('jwt_token', data.jwt_token, {expires: 30})
      const {history} = this.props
      history.replace('/')
    } else {
      this.setState({errMsg: `*${data.error_msg}`})
    }
  }

  render() {
    const {userName, passWord, showPasswd, errMsg} = this.state

    return (
      <div className='login'>
        <div className='login__card'>
          {/* LOGO */}
          <img src={logo} alt='website logo' className='login__logo' />

          {/* FORM */}
          <form className='login__form' onSubmit={this.verifyUserCredientials}>
            {/* USERNAME */}
            <label htmlFor='username' className='login__label'>
              USERNAME
            </label>
            <input
              id='username'
              type='text'
              placeholder='Enter Username'
              value={userName}
              onChange={e => this.setState({userName: e.target.value})}
              className='login__input'
            />

            {/* PASSWORD */}
            <label htmlFor='password' className='login__label'>
              PASSWORD
            </label>
            <input
              id='password'
              type={showPasswd ? 'text' : 'password'}
              placeholder='Enter Password'
              value={passWord}
              onChange={e => this.setState({passWord: e.target.value})}
              className='login__input'
            />
            
            {/* SHOW PASSWORD */}
            <div className='login__checkbox'>
              <input
                type='checkbox'
                onChange={e => this.setState({showPasswd: e.target.checked})}
              />
              <span>Show Password</span>
            </div>

            {/* BUTTON */}
            <button type='submit' className='login__btn'>
              Login
            </button>

            {/* ERROR */}
            {errMsg && <p className='login__error'>{errMsg}</p>}
          </form>
        </div>
      </div>
    )
  }
}

export default Login
