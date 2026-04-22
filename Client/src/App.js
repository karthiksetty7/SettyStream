import {Component} from 'react'
import {Route, Switch} from 'react-router-dom'

import ProtectedRoute from './components/ProtectedRoute'
import Login from './components/Login'
import Home from './components/Home'
import SpecificVideo from './components/SpecificVideo'
import Trending from './components/Trending'
import SavingVideos from './components/SavingVideos'
import Gaming from './components/Gaming'
import NotFound from './components/NotFound'
import History from './components/History'
import LikedVideos from './components/LikedVideos'
import BackgroundContext from './BackgroundContext'
import {apiRequest} from './utils/api'

import './App.css'

class App extends Component {
  state = {
    isDarkMode: false,
    savedVideos: [],
    likedVideos: [],
    dislikedVideos: JSON.parse(localStorage.getItem('dislikedVideos')) || [],
    historyVideos: [],
  }

  componentDidMount() {
    this.getHistoryVideos()
    this.getSavedVideos()
    this.getLikedVideos()
  }

  componentDidUpdate(prevProps, prevState) {
    const {dislikedVideos} = this.state

    if (prevState.dislikedVideos !== dislikedVideos) {
      localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos))
    }
  }

  formatVideoData = video => ({
    ...video,
    thumbnailUrl: video.thumbnail_url,
    viewCount: video.view_count,
    publishedAt: video.published_at,
    videoUrl: video.video_url,
    channel: {
      ...video.channel,
      profileImageUrl: video.channel?.profile_image_url,
    },
  })

  normalizeVideoPayload = video => ({
    ...video,
    thumbnail_url: video.thumbnail_url || video.thumbnailUrl,
    view_count: video.view_count || video.viewCount,
    published_at: video.published_at || video.publishedAt,
    video_url: video.video_url || video.videoUrl,
    channel: {
      ...video.channel,
      profile_image_url:
        video.channel?.profile_image_url || video.channel?.profileImageUrl,
    },
  })

  getSavedVideos = async () => {
    const data = await apiRequest({
      endpoint: '/saved-videos',
      method: 'GET',
    })

    if (data.success === false) {
      return
    }

    const formattedSavedVideos = (data.savedVideos || []).map(item =>
      this.formatVideoData(item.video),
    )

    this.setState({
      savedVideos: formattedSavedVideos,
    })
  }

  addSavedVideo = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: '/saved-videos',
      method: 'POST',
      body: payload,
    })

    if (data.success === false || !data.savedVideo) {
      console.error('Failed to save video:', data)
      return
    }

    const formattedSavedVideo = this.formatVideoData(data.savedVideo.video)

    this.setState(prevState => {
      const filteredSavedVideos = prevState.savedVideos.filter(
        each => each.id !== formattedSavedVideo.id,
      )

      return {
        savedVideos: [formattedSavedVideo, ...filteredSavedVideos],
      }
    })
  }

  removeSavedVideo = async id => {
    const data = await apiRequest({
      endpoint: `/saved-videos/${id}`,
      method: 'DELETE',
    })

    if (data.success === false) {
      return
    }

    this.setState(prevState => ({
      savedVideos: prevState.savedVideos.filter(each => each.id !== id),
    }))
  }

  toggleSaveVideo = async video => {
    const {savedVideos} = this.state
    const exists = savedVideos.find(each => each.id === video.id)

    if (exists) {
      await this.removeSavedVideo(video.id)
    } else {
      await this.addSavedVideo(video)
    }
  }

  getLikedVideos = async () => {
    const data = await apiRequest({
      endpoint: '/liked-videos',
      method: 'GET',
    })

    if (data.success === false) {
      return
    }

    const formattedLikedVideos = (data.likedVideos || []).map(item =>
      this.formatVideoData(item.video),
    )

    this.setState({
      likedVideos: formattedLikedVideos,
    })
  }

  addLikedVideo = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: '/liked-videos',
      method: 'POST',
      body: payload,
    })

    if (data.success === false || !data.likedVideo) {
      console.error('Failed to like video:', data)
      return false
    }

    const formattedLikedVideo = this.formatVideoData(data.likedVideo.video)

    this.setState(prevState => {
      const filteredLikedVideos = prevState.likedVideos.filter(
        each => each.id !== formattedLikedVideo.id,
      )

      return {
        likedVideos: [formattedLikedVideo, ...filteredLikedVideos],
        dislikedVideos: prevState.dislikedVideos.filter(
          each => each.id !== formattedLikedVideo.id,
        ),
      }
    })

    return true
  }

  removeLikedVideo = async id => {
    const data = await apiRequest({
      endpoint: `/liked-videos/${id}`,
      method: 'DELETE',
    })

    if (data.success === false) {
      return false
    }

    this.setState(prevState => ({
      likedVideos: prevState.likedVideos.filter(each => each.id !== id),
    }))

    return true
  }

  toggleTheme = () => {
    this.setState(prevState => ({isDarkMode: !prevState.isDarkMode}))
  }

  likeVideo = async video => {
    const exists = this.state.likedVideos.find(each => each.id === video.id)

    if (exists) {
      return
    }

    await this.addLikedVideo(video)
  }

  dislikeVideo = async video => {
    const isLiked = this.state.likedVideos.some(each => each.id === video.id)

    if (isLiked) {
      await this.removeLikedVideo(video.id)
    }

    this.setState(prevState => {
      const exists = prevState.dislikedVideos.find(each => each.id === video.id)

      if (exists) {
        return {
          dislikedVideos: prevState.dislikedVideos.filter(
            each => each.id !== video.id,
          ),
        }
      }

      return {
        dislikedVideos: [...prevState.dislikedVideos, video],
      }
    })
  }

  removeLike = async video => {
    await this.removeLikedVideo(video.id)
  }

  getHistoryVideos = async () => {
    const data = await apiRequest({
      endpoint: '/history',
      method: 'GET',
    })

    if (data.success === false) {
      return
    }

    const formattedHistory = (data.historyVideos || []).map(item => ({
      ...item,
      video: this.formatVideoData(item.video),
    }))

    this.setState({
      historyVideos: formattedHistory,
    })
  }

  clearHistoryVideos = async () => {
    const data = await apiRequest({
      endpoint: '/history',
      method: 'DELETE',
    })

    if (data.success === false) {
      return
    }

    this.setState({historyVideos: []})
  }

  addToHistory = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: '/history',
      method: 'POST',
      body: payload,
    })

    if (data.success === false || !data.historyVideo) {
      console.error('Failed to add history:', data)
      return
    }

    const item = data.historyVideo

    const formattedHistoryItem = {
      ...item,
      video: this.formatVideoData(item.video),
    }

    this.setState(prevState => {
      const filteredHistory = prevState.historyVideos.filter(
        each => each.videoId !== formattedHistoryItem.videoId,
      )

      return {
        historyVideos: [formattedHistoryItem, ...filteredHistory],
      }
    })
  }

  refreshHistory = async () => {
    await this.getHistoryVideos()
  }

  removeHistoryVideo = async videoId => {
    const data = await apiRequest({
      endpoint: `/history/${videoId}`,
      method: 'DELETE',
    })

    if (data.success === false) {
      return
    }

    this.setState(prevState => ({
      historyVideos: prevState.historyVideos.filter(
        each => each.videoId !== videoId,
      ),
    }))
  }

  render() {
    return (
      <BackgroundContext.Provider
        value={{
          ...this.state,
          toggleTheme: this.toggleTheme,
          toggleSaveVideo: this.toggleSaveVideo,
          likeVideo: this.likeVideo,
          dislikeVideo: this.dislikeVideo,
          removeLike: this.removeLike,
          addToHistory: this.addToHistory,
          clearHistoryVideos: this.clearHistoryVideos,
          removeSavedVideo: this.removeSavedVideo,
          removeHistoryVideo: this.removeHistoryVideo,
          removeLikedVideo: this.removeLikedVideo,
          refreshHistory: this.refreshHistory,
          getHistoryVideos: this.getHistoryVideos,
          getSavedVideos: this.getSavedVideos,
          addSavedVideo: this.addSavedVideo,
          getLikedVideos: this.getLikedVideos,
          addLikedVideo: this.addLikedVideo,
        }}
      >
        <Switch>
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/videos/:id" component={SpecificVideo} />
          <ProtectedRoute path="/trending" component={Trending} />
          <ProtectedRoute path="/gaming" component={Gaming} />
          <ProtectedRoute path="/saved-videos" component={SavingVideos} />
          <ProtectedRoute path="/liked-videos" component={LikedVideos} />
          <ProtectedRoute path="/history" component={History} />
          <Route component={NotFound} />
        </Switch>
      </BackgroundContext.Provider>
    )
  }
}

export default App
