import {useContext, useEffect, useRef, useState} from 'react'
import {MdHistory} from 'react-icons/md'
import {HiDotsVertical} from 'react-icons/hi'

import BackgroundContext from '../../BackgroundContext'
import Header from '../Header'
import LeftNavBar from '../LeftNavBar'
import CommonVideosList from '../CommonVideosList'

import '../../CommonVideosPage.css'

const History = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const {
    historyVideos,
    isDarkMode,
    clearHistoryVideos,
    removeHistoryVideo,
    refreshHistory,
  } = useContext(BackgroundContext)

  useEffect(() => {
    if (refreshHistory) {
      refreshHistory()
    }
  }, [refreshHistory])

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const pageClassName = `common-page ${isDarkMode ? 'common-page--dark' : ''}`
  const hasHistory = historyVideos.length > 0

  const onClickDeleteAll = () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete all history videos?',
    )

    if (confirmed) {
      clearHistoryVideos()
      setIsMenuOpen(false)
    }
  }

  return (
    <>
      <Header />
      <div className="nav-sections-container">
        <LeftNavBar />
        <main className={pageClassName}>
          <div className="common-page__header common-page__header--between">
            <div className="common-page__title-wrap">
              <MdHistory className="common-page__icon" />
              <h1>History</h1>
            </div>

            {hasHistory && (
              <div className="common-page__menu-wrap" ref={menuRef}>
                <button
                  type="button"
                  className="common-page__menu-btn"
                  onClick={() => setIsMenuOpen(prev => !prev)}
                  aria-label="History options"
                >
                  <HiDotsVertical size={18} />
                </button>

                {isMenuOpen && (
                  <div
                    className={`common-page__dropdown ${
                      isDarkMode ? 'common-page__dropdown--dark' : ''
                    }`}
                  >
                    <button
                      type="button"
                      className="common-page__dropdown-item common-page__dropdown-item--danger"
                      onClick={onClickDeleteAll}
                    >
                      Clear all watch History
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {hasHistory ? (
            <ul className="common-page__grid">
              {historyVideos.map(({video}) => (
                <li key={video.id}>
                  <CommonVideosList
                    eachVideo={video}
                    onDeleteVideo={removeHistoryVideo}
                    deleteLabel="Remove from Watch History"
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="common-page__empty">
              <h2>No history available</h2>
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default History
