import {AiOutlineDownload} from 'react-icons/ai'

import BackgroundContext from '../../BackgroundContext'
import Header from '../Header'
import LeftNavBar from '../LeftNavBar'
import CommonVideosList from '../CommonVideosList'

import '../../CommonVideosPage.css'

const Downloads = () => (
  <BackgroundContext.Consumer>
    {({isDarkMode, downloadedVideos, removeDownloadedVideo}) => {
      const pageClassName = `common-page ${
        isDarkMode ? 'common-page--dark' : ''
      }`

      return (
        <>
          <Header />
          <div className="nav-sections-container">
            <LeftNavBar />
            <main className={pageClassName}>
              <div className="common-page__header common-page__header--between">
                <div className="common-page__title-wrap">
                  <AiOutlineDownload className="common-page__icon" />
                  <h1>Downloads</h1>
                </div>
              </div>

              {downloadedVideos.length === 0 ? (
                <div className="common-page__empty">
                  <h2>No Downloads Yet</h2>
                  <p>Download videos to watch offline</p>
                </div>
              ) : (
                <ul className="common-page__grid">
                  {downloadedVideos.map(eachVideo => (
                    <li key={eachVideo.id}>
                      <CommonVideosList
                        eachVideo={eachVideo}
                        onDeleteVideo={removeDownloadedVideo}
                        showSaveOption={false}
                        showDownloadOption={false}
                        showShareOption={false}
                        showDeleteOption
                        deleteLabel="Delete from downloads"
                      />
                    </li>
                  ))}
                </ul>
              )}
            </main>
          </div>
        </>
      )
    }}
  </BackgroundContext.Consumer>
)

export default Downloads