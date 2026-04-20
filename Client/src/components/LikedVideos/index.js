import {AiFillLike} from 'react-icons/ai'

import BackgroundContext from '../../BackgroundContext'
import Header from '../Header'
import LeftNavBar from '../LeftNavBar'
import CommonVideosList from '../CommonVideosList'

import '../../CommonVideosPage.css'

const LikedVideos = () => (
  <BackgroundContext.Consumer>
    {({likedVideos, isDarkMode, removeLikedVideo}) => {
      const pageClassName = `common-page ${isDarkMode ? 'common-page--dark' : ''}`
      const hasLikedVideos = likedVideos.length > 0

      return (
        <>
          <Header />
          <div className="nav-sections-container">
            <LeftNavBar />
            <main className={pageClassName}>
              <div className="common-page__header common-page__header--between">
                <div className="common-page__title-wrap">
                  <AiFillLike className="common-page__icon" />
                  <h1>Liked Videos</h1>
                </div>
              </div>

              {hasLikedVideos ? (
                <ul className="common-page__grid">
                  {likedVideos.map(video => (
                    <li key={video.id}>
                      <CommonVideosList
                        eachVideo={video}
                        onDeleteVideo={removeLikedVideo}
                        deleteLabel="Remove from Liked Videos"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="common-page__empty">
                  <h2>No liked videos</h2>
                </div>
              )}
            </main>
          </div>
        </>
      )
    }}
  </BackgroundContext.Consumer>
)

export default LikedVideos