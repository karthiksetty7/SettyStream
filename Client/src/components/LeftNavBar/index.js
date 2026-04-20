import {FaFire} from 'react-icons/fa'
import {SiYoutubegaming} from 'react-icons/si'
import {IoMdHome} from 'react-icons/io'
import {MdHistory} from 'react-icons/md'
import {AiOutlineDownload, AiFillLike} from 'react-icons/ai'
import {BiListPlus} from 'react-icons/bi'

import {Link, withRouter} from 'react-router-dom'

import BackgroundContext from '../../BackgroundContext'

import './index.css'

const navItems = [
  {path: '/', label: 'Home', icon: IoMdHome},
  {path: '/trending', label: 'Trending', icon: FaFire},
  {path: '/gaming', label: 'Gaming', icon: SiYoutubegaming},
  {path: '/saved-videos', label: 'Saved Videos', icon: BiListPlus},
  {path: '/liked-videos', label: 'Liked Videos', icon: AiFillLike},
  {path: '/history', label: 'History', icon: MdHistory},
  {path: '/downloads', label: 'Downloads', icon: AiOutlineDownload},
]

const LeftNavBar = props => (
  <BackgroundContext.Consumer>
    {value => {
      const {isDarkMode} = value
      const {location} = props

      return (
        <aside className={`sidebar ${isDarkMode ? 'sidebar--dark' : ''}`}>
          {/* NAV ITEMS */}
          <ul className='sidebar__menu'>
            {navItems.map(item => {
              const isActive = location.pathname === item.path
              const Icon = item.icon

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar__link ${
                      isActive ? 'sidebar__link--active' : ''
                    }`}
                  >
                    <Icon className='sidebar__icon' size={20} />
                    <span className='sidebar__label'>{item.label}</span>
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* CONTACT SECTION */}
          <div className='sidebar__contact'>
            <p className='sidebar__contact-title'>Contact Us</p>

            <div className='sidebar__social'>
              <img
                src='https://assets.ccbp.in/frontend/react-js/nxt-watch-facebook-logo-img.png'
                alt='facebook'
              />
              <img
                src='https://assets.ccbp.in/frontend/react-js/nxt-watch-twitter-logo-img.png'
                alt='twitter'
              />
              <img
                src='https://assets.ccbp.in/frontend/react-js/nxt-watch-linked-in-logo-img.png'
                alt='linkedin'
              />
            </div>

            <p className='sidebar__contact-text'>
              Enjoy! Now to see your channels and recommendations!
            </p>
          </div>
        </aside>
      )
    }}
  </BackgroundContext.Consumer>
)

export default withRouter(LeftNavBar)
