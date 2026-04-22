import {BsMoon, BsSun, BsBoxArrowRight} from 'react-icons/bs'
import {withRouter, Link} from 'react-router-dom'
import Popup from 'reactjs-popup'
import Cookies from 'js-cookie'

import BackgroundContext from '../../BackgroundContext'

import logo from '../../SettyStream.png'
import darkLogo from '../../SettyStreamdarkTheme.png'

import './index.css'

const Header = props => (
  <BackgroundContext.Consumer>
    {value => {
      const {isDarkMode, toggleTheme} = value

      const onLogout = () => {
        Cookies.remove('token')
        Cookies.remove('jwt_token')

        localStorage.removeItem('token')
        localStorage.removeItem('jwt_token')
        localStorage.removeItem('user_id')
        localStorage.removeItem('username')
        localStorage.removeItem('user_name')

        window.dispatchEvent(new Event('auth-change'))
        props.history.replace('/login')
      }

      const renderPopup = close => (
        <div
          className={`header__popup ${isDarkMode ? 'header__popup--dark' : ''}`}
        >
          <p className="header__popup-text">Are you sure you want to logout?</p>

          <div className="header__popup-actions">
            <button
              type="button"
              className={`btn btn--outline ${
                isDarkMode ? 'btn--outline-dark' : ''
              }`}
              onClick={() => close()}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn btn--primary"
              onClick={() => {
                close()
                onLogout()
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      )

      return (
        <nav className={`header ${isDarkMode ? 'header--dark' : ''}`}>
          <Link to="/" className="header__logo-container">
            <img
              src={isDarkMode ? darkLogo : logo}
              alt="website logo"
              className="header__logo"
            />
          </Link>

          <div className="header__actions">
            <button
              type="button"
              className="header__icon-btn"
              onClick={toggleTheme}
              aria-label={isDarkMode ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              {isDarkMode ? (
                <BsSun size={22} color="#fff" />
              ) : (
                <BsMoon size={22} />
              )}
            </button>

            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png"
              alt="profile"
              className="header__profile"
            />

            <Popup
              modal
              trigger={
                <button type="button" className="header__logout-btn">
                  Logout
                </button>
              }
            >
              {renderPopup}
            </Popup>

            <Popup
              modal
              trigger={
                <button
                  type="button"
                  className="header__icon-btn header__logout-icon"
                  aria-label="Logout"
                >
                  <BsBoxArrowRight
                    size={22}
                    color={isDarkMode ? '#ffffff' : '#000000'}
                  />
                </button>
              }
            >
              {renderPopup}
            </Popup>
          </div>
        </nav>
      )
    }}
  </BackgroundContext.Consumer>
)

export default withRouter(Header)
