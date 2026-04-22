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
    dislikedVideos: [],
    historyVideos: [],
    authToken: localStorage.getItem('jwt_token') || '',
    activeUserKey: localStorage.getItem('user_id') || '',
    isUserDataLoading: false,
  }

  savedRequestId = 0
  likedRequestId = 0
  dislikedRequestId = 0
  historyRequestId = 0
  bootstrapRequestId = 0

  componentDidMount() {
    this.bootstrapUserData()
    window.addEventListener('storage', this.handleStorageChange)
    window.addEventListener('auth-change', this.handleAuthChange)
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.handleStorageChange)
    window.removeEventListener('auth-change', this.handleAuthChange)
  }

  getAuthSnapshot = () => ({
    authToken: localStorage.getItem('jwt_token') || '',
    activeUserKey:
      localStorage.getItem('user_id') ||
      localStorage.getItem('username') ||
      localStorage.getItem('user_name') ||
      '',
  })

  handleStorageChange = event => {
    if (
      event.key === 'jwt_token' ||
      event.key === 'user_id' ||
      event.key === 'username' ||
      event.key === 'user_name'
    ) {
      this.bootstrapUserData()
    }
  }

  handleAuthChange = () => {
    this.bootstrapUserData()
  }

  clearUserVideoState = callback => {
    this.setState(
      {
        savedVideos: [],
        likedVideos: [],
        dislikedVideos: [],
        historyVideos: [],
      },
      callback,
    )
  }

  bootstrapUserData = async () => {
    const {authToken, activeUserKey} = this.getAuthSnapshot()
    const currentBootstrapId = Date.now()
    this.bootstrapRequestId = currentBootstrapId

    const authChanged =
      authToken !== this.state.authToken ||
      activeUserKey !== this.state.activeUserKey

    if (authChanged) {
      this.setState({
        authToken,
        activeUserKey,
      })
      this.clearUserVideoState()
    }

    if (!authToken) {
      this.setState({
        authToken: '',
        activeUserKey: '',
        isUserDataLoading: false,
      })
      this.clearUserVideoState()
      return
    }

    this.setState({isUserDataLoading: true})

    await Promise.all([
      this.getSavedVideos({silent: true, force: true}),
      this.getLikedVideos({silent: true, force: true}),
      this.getDislikedVideos({silent: true, force: true}),
      this.getHistoryVideos({silent: true, force: true}),
    ])

    if (this.bootstrapRequestId === currentBootstrapId) {
      this.setState({isUserDataLoading: false})
    }
  }

  formatVideoData = video => ({
    ...video,
    thumbnailUrl: video.thumbnailurl || video.thumbnailUrl || '',
    viewCount: video.viewcount || video.viewCount || '',
    publishedAt: video.publishedat || video.publishedAt || '',
    videoUrl: video.videourl || video.videoUrl || '',
    channel: {
      ...video.channel,
      profileImageUrl:
        video.channel?.profileimageurl || video.channel?.profileImageUrl || '',
    },
  })

  normalizeVideoPayload = video => ({
    id: video.id,
    title: video.title,
    thumbnailurl: video.thumbnailurl || video.thumbnailUrl || '',
    viewcount: video.viewcount || video.viewCount || '',
    publishedat: video.publishedat || video.publishedAt || '',
    videourl: video.videourl || video.videoUrl || '',
    description: video.description || '',
    category: video.category || '',
    channel: {
      name: video.channel?.name || 'Unknown Channel',
      profileimageurl:
        video.channel?.profileimageurl || video.channel?.profileImageUrl || '',
      subscribercount:
        video.channel?.subscribercount || video.channel?.subscriberCount || '',
    },
  })

  getSavedVideos = async (options = {}) => {
    const {silent = false} = options
    const requestId = Date.now()
    this.savedRequestId = requestId

    const data = await apiRequest({
      endpoint: 'saved-videos',
      method: 'GET',
    })

    if (this.savedRequestId !== requestId) return
    if (!data.success) {
      if (!silent) this.setState({savedVideos: []})
      return
    }

    const formattedSavedVideos = data.savedVideos.map(item =>
      this.formatVideoData(item.video),
    )

    this.setState({savedVideos: formattedSavedVideos})
  }

  addSavedVideo = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: 'saved-videos',
      method: 'POST',
      body: payload,
    })

    if (!data.success || !data.savedVideo) {
      console.error('Failed to save video', data)
      return false
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

    return true
  }

  removeSavedVideo = async id => {
    const data = await apiRequest({
      endpoint: `saved-videos/${id}`,
      method: 'DELETE',
    })

    if (!data.success) return false

    this.setState(prevState => ({
      savedVideos: prevState.savedVideos.filter(each => each.id !== id),
    }))

    return true
  }

  toggleSaveVideo = async video => {
    const {savedVideos} = this.state
    const exists = savedVideos.find(each => each.id === video.id)

    if (exists) {
      return this.removeSavedVideo(video.id)
    }

    return this.addSavedVideo(video)
  }

  getLikedVideos = async (options = {}) => {
    const {silent = false} = options
    const requestId = Date.now()
    this.likedRequestId = requestId

    const data = await apiRequest({
      endpoint: 'liked-videos',
      method: 'GET',
    })

    if (this.likedRequestId !== requestId) return
    if (!data.success) {
      if (!silent) this.setState({likedVideos: []})
      return
    }

    const formattedLikedVideos = data.likedVideos.map(item =>
      this.formatVideoData(item.video),
    )

    this.setState({likedVideos: formattedLikedVideos})
  }

  addLikedVideo = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: 'liked-videos',
      method: 'POST',
      body: payload,
    })

    if (!data.success || !data.likedVideo) {
      console.error('Failed to like video', data)
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
      endpoint: `liked-videos/${id}`,
      method: 'DELETE',
    })

    if (!data.success) return false

    this.setState(prevState => ({
      likedVideos: prevState.likedVideos.filter(each => each.id !== id),
    }))

    return true
  }

  getDislikedVideos = async (options = {}) => {
    const {silent = false} = options
    const requestId = Date.now()
    this.dislikedRequestId = requestId

    const data = await apiRequest({
      endpoint: 'disliked-videos',
      method: 'GET',
    })

    if (this.dislikedRequestId !== requestId) return
    if (!data.success) {
      if (!silent) this.setState({dislikedVideos: []})
      return
    }

    const formattedDislikedVideos = data.dislikedVideos.map(item =>
      this.formatVideoData(item.video),
    )

    this.setState({dislikedVideos: formattedDislikedVideos})
  }

  toggleDislikedVideo = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: 'disliked-videos',
      method: 'POST',
      body: payload,
    })

    if (!data.success) {
      console.error('Failed to toggle disliked video', data)
      return null
    }

    return data
  }

  removeDislikedVideo = async id => {
    const data = await apiRequest({
      endpoint: `disliked-videos/${id}`,
      method: 'DELETE',
    })

    if (!data.success) return false

    this.setState(prevState => ({
      dislikedVideos: prevState.dislikedVideos.filter(each => each.id !== id),
    }))

    return true
  }

  toggleTheme = () => {
    this.setState(prevState => ({
      isDarkMode: !prevState.isDarkMode,
    }))
  }

  likeVideo = async video => {
    const exists = this.state.likedVideos.find(each => each.id === video.id)
    if (exists) return false

    const added = await this.addLikedVideo(video)

    if (added) {
      this.setState(prevState => ({
        dislikedVideos: prevState.dislikedVideos.filter(
          each => each.id !== video.id,
        ),
      }))
    }

    return added
  }

  dislikeVideo = async video => {
    const response = await this.toggleDislikedVideo(video)

    if (!response) return null

    if (response.action === 'removed') {
      this.setState(prevState => ({
        dislikedVideos: prevState.dislikedVideos.filter(
          each => each.id !== video.id,
        ),
      }))
      return response
    }

    if (response.action === 'added') {
      const formattedVideo = response.dislikedVideo?.video
        ? this.formatVideoData(response.dislikedVideo.video)
        : video

      this.setState(prevState => {
        const filteredDislikedVideos = prevState.dislikedVideos.filter(
          each => each.id !== formattedVideo.id,
        )

        return {
          dislikedVideos: [formattedVideo, ...filteredDislikedVideos],
          likedVideos: prevState.likedVideos.filter(
            each => each.id !== formattedVideo.id,
          ),
        }
      })
    }

    return response
  }

  removeLike = async video => this.removeLikedVideo(video.id)

  getHistoryVideos = async (options = {}) => {
    const {silent = false} = options
    const requestId = Date.now()
    this.historyRequestId = requestId

    const data = await apiRequest({
      endpoint: 'history',
      method: 'GET',
    })

    if (this.historyRequestId !== requestId) return
    if (!data.success) {
      if (!silent) this.setState({historyVideos: []})
      return
    }

    const formattedHistory = data.historyVideos.map(item => ({
      ...item,
      video: this.formatVideoData(item.video),
    }))

    this.setState({historyVideos: formattedHistory})
  }

  clearHistoryVideos = async () => {
    const data = await apiRequest({
      endpoint: 'history',
      method: 'DELETE',
    })

    if (!data.success) return false

    this.setState({historyVideos: []})
    return true
  }

  addToHistory = async video => {
    const payload = this.normalizeVideoPayload(video)

    const data = await apiRequest({
      endpoint: 'history',
      method: 'POST',
      body: payload,
    })

    if (!data.success || !data.historyVideo) {
      console.error('Failed to add history', data)
      return false
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

    return true
  }

  refreshHistory = async () => {
    await this.getHistoryVideos({force: true})
  }

  removeHistoryVideo = async videoId => {
    const data = await apiRequest({
      endpoint: `history/${videoId}`,
      method: 'DELETE',
    })

    if (!data.success) return false

    this.setState(prevState => ({
      historyVideos: prevState.historyVideos.filter(
        each => each.videoId !== videoId,
      ),
    }))

    return true
  }

  setAuthenticatedUser = userData => {
    const token = userData?.token || localStorage.getItem('jwt_token') || ''
    const activeUserKey =
      userData?.user_id ||
      userData?.id ||
      userData?.username ||
      localStorage.getItem('user_id') ||
      ''

    this.setState(
      {
        authToken: token,
        activeUserKey,
      },
      () => {
        this.clearUserVideoState(() => {
          this.bootstrapUserData()
        })
      },
    )
  }

  logoutUser = () => {
    localStorage.removeItem('jwt_token')
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    localStorage.removeItem('user_name')

    this.setState(
      {
        authToken: '',
        activeUserKey: '',
      },
      () => {
        this.clearUserVideoState()
      },
    )

    window.dispatchEvent(new Event('auth-change'))
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
          removeDislikedVideo: this.removeDislikedVideo,
          refreshHistory: this.refreshHistory,
          getHistoryVideos: this.getHistoryVideos,
          getSavedVideos: this.getSavedVideos,
          addSavedVideo: this.addSavedVideo,
          getLikedVideos: this.getLikedVideos,
          addLikedVideo: this.addLikedVideo,
          getDislikedVideos: this.getDislikedVideos,
          toggleDislikedVideo: this.toggleDislikedVideo,
          setAuthenticatedUser: this.setAuthenticatedUser,
          logoutUser: this.logoutUser,
          bootstrapUserData: this.bootstrapUserData,
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
