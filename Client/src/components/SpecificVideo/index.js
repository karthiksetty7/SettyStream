import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ReactPlayer from 'react-player'
import {BiLike, BiDislike, BiListPlus} from 'react-icons/bi'

import Header from '../Header'
import LeftNavBar from '../LeftNavBar'
import BackgroundContext from '../../BackgroundContext'
import {apiRequest} from '../../utils/api'

import './index.css'

const apiStatusConstants = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
}

class SpecificVideo extends Component {
  static contextType = BackgroundContext

  state = {
    videoDetails: null,
    apiStatus: apiStatusConstants.INITIAL,
  }

  componentDidMount() {
    this.getVideoDetails()
  }

  getFormattedVideoDetails = data => ({
    id: data.id,
    title: data.title,
    videoUrl: data.video_url || '',
    thumbnailUrl: data.thumbnail_url || '',
    viewCount: data.view_count || '',
    description: data.description || '',
    publishedAt: data.published_at || '',
    channel: {
      name: data.channel?.name || 'Unknown Channel',
      profileImageUrl:
        data.channel?.profile_image_url ||
        'https://assets.ccbp.in/frontend/react-js/nxt-watch-profile-img.png',
      subscriberCount: data.channel?.subscriber_count || '',
    },
  })

getHistoryPayload = data => ({
  id: data.id,
  title: data.title,
  thumbnailurl: data.thumbnailUrl || data.thumbnail_url || '',  
  viewcount: data.viewCount || data.view_count || '',          
  publishedat: data.publishedAt || data.published_at || '',   
  videourl: data.videoUrl || data.video_url || '',             
  description: data.description || '',
  category: data.category || '',
  channel: {
    name: data.channel?.name || 'Unknown Channel',
    profileimageurl: data.channel?.profileImageUrl || data.channel?.profile_image_url || '',
    subscribercount: data.channel?.subscriberCount || data.channel?.subscriber_count || '',
  },
})


  getVideoDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.LOADING})

    const {match} = this.props
    const {id} = match.params

    try {
      const response = await apiRequest({
        endpoint: `/videos/${id}`,
        method: 'GET',
        isPublic: true,
      })

      if (response && response.success) {
        const updatedData = this.getFormattedVideoDetails(response.video)
        const historyPayload = this.getHistoryPayload(response.video)

        this.setState({
          videoDetails: updatedData,
          apiStatus: apiStatusConstants.SUCCESS,
        })

        await this.context.addToHistory(historyPayload)
      } else {
        this.setState({apiStatus: apiStatusConstants.FAILURE})
      }
    } catch {
      this.setState({apiStatus: apiStatusConstants.FAILURE})
    }
  }

  onClickLike = async videoDetails => {
    const {likedVideos, likeVideo, removeLike} = this.context
    const isLiked = likedVideos.find(eachVideo => eachVideo.id === videoDetails.id)

    if (isLiked) {
      await removeLike(videoDetails)
    } else {
      await likeVideo(videoDetails)
    }
  }

  onClickDislike = async videoDetails => {
    const {
      likedVideos,
      dislikedVideos,
      dislikeVideo,
      removeDislikedVideo,
      removeLike,
    } = this.context

    const isDisliked = dislikedVideos.find(
      eachVideo => eachVideo.id === videoDetails.id,
    )

    if (isDisliked) {
      await removeDislikedVideo(videoDetails.id)
      return
    }

    const isLiked = likedVideos.find(eachVideo => eachVideo.id === videoDetails.id)

    if (isLiked) {
      await removeLike(videoDetails)
    }

    await dislikeVideo(videoDetails)
  }

  onClickSave = async videoDetails => {
    await this.context.toggleSaveVideo(videoDetails)
  }

  renderLoader = isDarkMode => (
    <div className="loader-container" data-testid="loader">
      <Loader
        type="ThreeDots"
        color={isDarkMode ? '#ffffff' : '#4f46e5'}
        height={50}
        width={50}
      />
    </div>
  )

  renderFailureView = isDarkMode => (
    <div
      className={`video-page-error ${isDarkMode ? 'video-page-error--dark' : ''}`}
    >
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view.png"
        alt="failure view"
        className="video-page-error-image"
      />
      <h2>Oops! Something went wrong</h2>
      <p>
        We are having some trouble to complete your request. Please try again.
      </p>
      <button type="button" onClick={this.getVideoDetails}>
        Retry
      </button>
    </div>
  )

  renderVideoContent = () => {
    const {videoDetails} = this.state
    const {
      isDarkMode,
      savedVideos,
      likedVideos,
      dislikedVideos,
    } = this.context

    const isSaved = savedVideos.find(eachVideo => eachVideo.id === videoDetails.id)
    const isLiked = likedVideos.find(eachVideo => eachVideo.id === videoDetails.id)
    const isDisliked = dislikedVideos.find(
      eachVideo => eachVideo.id === videoDetails.id,
    )

    const {title, videoUrl, viewCount, description, channel} = videoDetails

    return (
      <div className="video-page-container">
        <div className="video-page-content">
          <ReactPlayer url={videoUrl} controls width="100%" />

          <h2 className="video-page-title">{title}</h2>

          <div className="video-page-actions">
            <p className="video-page-views">{viewCount} views</p>

            <div className="video-page-buttons">
              <button
                type="button"
                className={`video-btn ${isLiked ? 'active-like' : ''}`}
                onClick={() => this.onClickLike(videoDetails)}
              >
                <BiLike />
                Like
              </button>

              <button
                type="button"
                className={`video-btn ${isDisliked ? 'active-dislike' : ''}`}
                onClick={() => this.onClickDislike(videoDetails)}
              >
                <BiDislike />
                Dislike
              </button>

              <button
                type="button"
                className={`video-btn ${isSaved ? 'active-save' : ''}`}
                onClick={() => this.onClickSave(videoDetails)}
              >
                <BiListPlus />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>

          <hr className="video-page-divider" />

          <div className="video-page-channel">
            <img
              src={channel.profileImageUrl}
              alt="channel logo"
              className="video-page-channel-img"
            />
            <div className="video-page-channel-info">
              <p
                className={`video-page-channel-name ${
                  isDarkMode ? 'video-page-channel-name--dark' : ''
                }`}
              >
                {channel.name}
              </p>
              <p className="video-page-subscribers">
                {channel.subscriberCount} subscribers
              </p>
              <p
                className={`video-page-description ${
                  isDarkMode ? 'video-page-description--dark' : ''
                }`}
              >
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderVideoDetails = () => {
    const {apiStatus} = this.state
    const {isDarkMode} = this.context

    switch (apiStatus) {
      case apiStatusConstants.LOADING:
        return this.renderLoader(isDarkMode)
      case apiStatusConstants.SUCCESS:
        return this.renderVideoContent()
      case apiStatusConstants.FAILURE:
        return this.renderFailureView(isDarkMode)
      default:
        return null
    }
  }

  render() {
    const {isDarkMode} = this.context

    return (
      <>
        <Header />
        <div className="nav-sections-container">
          <LeftNavBar />
          <main className={`video-page ${isDarkMode ? 'video-page--dark' : ''}`}>
            {this.renderVideoDetails()}
          </main>
        </div>
      </>
    )
  }
}

export default SpecificVideo
