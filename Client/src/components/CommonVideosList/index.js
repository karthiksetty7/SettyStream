import {useState, useRef, useEffect, useContext} from 'react'
import {Link} from 'react-router-dom'
import {formatDistanceToNow, isValid} from 'date-fns'
import {HiDotsVertical} from 'react-icons/hi'

import BackgroundContext from '../../BackgroundContext'
import './index.css'

const CommonVideosList = props => {
  const {
    eachVideo,
    onDeleteVideo,
    showSaveOption = true,
    showShareOption = true,
    showDeleteOption = true,
    deleteLabel = 'Delete',
    showPublishedAt = true,
    showChannelInfo = true,
  } = props

  const {id, title, thumbnailUrl, viewCount, publishedAt, channel = {}} = eachVideo

  const name = channel?.name || 'Unknown Channel'
  const profileImageUrl =
    channel?.profileImageUrl ||
    'https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png'

  const [isOpen, setIsOpen] = useState(false)
  const [shareMessage, setShareMessage] = useState('')
  const menuRef = useRef(null)

  const {isDarkMode, toggleSaveVideo, savedVideos} = useContext(BackgroundContext)

  useEffect(() => {
    const handleClickOutside = event => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const baseUrl = process.env.REACT_APP_SITE_URL || window.location.origin
  const videoUrl = `${baseUrl}/videos/${id}`

  const parsedDate = publishedAt ? new Date(publishedAt) : null
  const isPublishedDateValid = parsedDate && isValid(parsedDate)

  const publishedText =
    showPublishedAt && isPublishedDateValid
      ? formatDistanceToNow(parsedDate, {addSuffix: true})
      : ''

  const isSaved = savedVideos?.some(each => each.id === id)

  const onClickSave = () => {
    toggleSaveVideo(eachVideo)
    setIsOpen(false)
  }

  const onClickDelete = () => {
    if (onDeleteVideo) {
      onDeleteVideo(id)
    }
    setIsOpen(false)
  }

  const showCopiedMessage = () => {
    setShareMessage('Link copied!')
    setTimeout(() => {
      setShareMessage('')
    }, 1500)
  }

  const onClickShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title,
          text: `Watch ${title}`,
          url: videoUrl,
        })
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(videoUrl)
        showCopiedMessage()
      }
    } catch (error) {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(videoUrl)
        showCopiedMessage()
      }
    }
    setIsOpen(false)
  }

  const hasMenuOptions =
    showSaveOption || showShareOption || (showDeleteOption && onDeleteVideo)

  return (
    <div className="video-card">
      <div className="video-card__top-row">
        <Link to={`/videos/${id}`} className="video-card__link">
          <img
            src={thumbnailUrl}
            alt="video thumbnail"
            className="video-card__thumbnail"
          />

          <div className="video-card__content">
            {showChannelInfo && (
              <img
                src={profileImageUrl}
                alt="channel logo"
                className="video-card__channel-img"
              />
            )}

            <div className="video-card__info">
              <h3
                className={`video-card__title ${isDarkMode ? 'dark-text' : ''}`}
              >
                {title}
              </h3>

              {showChannelInfo && (
                <p className="video-card__channel-name">{name}</p>
              )}

              <p className="video-card__meta">
                {viewCount} views
                {publishedText ? ` • ${publishedText}` : ''}
              </p>
            </div>
          </div>
        </Link>

        {hasMenuOptions && (
          <div className="video-card__menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="video-card__menu-btn"
              onClick={() => setIsOpen(prev => !prev)}
              aria-label="Video options"
            >
              <HiDotsVertical className="video-card__menu-icon" size={18} />
            </button>

            {isOpen && (
              <div
                className={`video-card__dropdown ${
                  isDarkMode ? 'video-card__dropdown--dark' : ''
                }`}
              >
                {showSaveOption && (
                  <button
                    type="button"
                    className="video-card__dropdown-item"
                    onClick={onClickSave}
                  >
                    {isSaved ? 'Remove from Watch Later' : 'Save to Watch Later'}
                  </button>
                )}

                {showShareOption && (
                  <button
                    type="button"
                    className="video-card__dropdown-item"
                    onClick={onClickShare}
                  >
                    Share
                  </button>
                )}

                {showDeleteOption && onDeleteVideo && (
                  <button
                    type="button"
                    className="video-card__dropdown-item video-card__dropdown-item--danger"
                    onClick={onClickDelete}
                  >
                    {deleteLabel}
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {shareMessage && (
          <p className="video-card__share-message">{shareMessage}</p>
        )}
      </div>
    </div>
  )
}

export default CommonVideosList
