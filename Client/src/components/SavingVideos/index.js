import {useContext, useEffect} from 'react'
import {BiListPlus} from 'react-icons/bi'

import BackgroundContext from '../../BackgroundContext'
import Header from '../Header'
import LeftNavBar from '../LeftNavBar'
import CommonVideosList from '../CommonVideosList'

import '../../CommonVideosPage.css'

const SavingVideos = () => {
  const {
    savedVideos,
    isDarkMode,
    removeSavedVideo,
    getSavedVideos,
  } = useContext(BackgroundContext)

  useEffect(() => {
    getSavedVideos()
  }, [getSavedVideos])

  const pageClassName = `common-page ${isDarkMode ? 'common-page--dark' : ''}`
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
}

export default SavingVideos
