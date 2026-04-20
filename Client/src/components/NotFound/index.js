import {Link} from 'react-router-dom'
import BackgroundContext from '../../BackgroundContext'

import './index.css'

const NotFound = () => (
  <BackgroundContext.Consumer>
    {({isDarkMode}) => (
      <div className={`notfound ${isDarkMode ? 'notfound--dark' : ''}`}>
        <img
          src={
            isDarkMode
              ? 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-dark-theme-img.png'
              : 'https://assets.ccbp.in/frontend/react-js/nxt-watch-not-found-light-theme-img.png'
          }
          alt='not found'
          className='notfound__img'
        />

        <h1>Page Not Found</h1>
        <p>We are sorry, the page you requested could not be found.</p>

        <Link to='/'>
          <button type="button" className='btn btn--primary'>Go to Home</button>
        </Link>
      </div>
    )}
  </BackgroundContext.Consumer>
)

export default NotFound
