import {BiListPlus} from 'react-icons/bi'

import BackgroundContext from '../../BackgroundContext'
import Header from '../Header'
import LeftNavBar from '../LeftNavBar'
import CommonVideosList from '../CommonVideosList'

import '../../CommonVideosPage.css'

const SavingVideos = () => (
  <BackgroundContext.Consumer>
    {({savedVideos, isDarkMode, removeSavedVideo}) => {
      const pageClassName = `common-page ${
        isDarkMode ? 'common-page--dark' : ''
      }`
      const hasSavedVideos = savedVideos.length > 0

      return (
        <>
          <Header />
          <div className="nav-sections-container">
            <LeftNavBar />
            <main className={pageClassName}>
              <div className="common-page__header common-page__header--between">
                <div className="common-page__title-wrap">
                  <BiListPlus className="common-page__icon" />
                  <h1>Saved Videos</h1>
                </div>
              </div>

              {hasSavedVideos ? (
                <ul className="common-page__grid">
                  {savedVideos.map(video => (
                    <li key={video.id}>
                      <CommonVideosList
                        eachVideo={video}
                        onDeleteVideo={removeSavedVideo}
                        showSaveOption={false}
                        showShareOption
                        showDeleteOption
                        deleteLabel="Remove from Watch Later"
                      />
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="common-page__empty">
                  <h2>No saved videos</h2>
                  <p>Save videos to watch later</p>
                </div>
              )}
            </main>
          </div>
        </>
      )
    }}
  </BackgroundContext.Consumer>
)

export default SavingVideos
