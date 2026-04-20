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
import Downloads from './components/Downloads'
import BackgroundContext from './BackgroundContext'

import './App.css'

class App extends Component {
  state = {
    isDarkMode: false,
    savedVideos: JSON.parse(localStorage.getItem('savedVideos')) || [],
    likedVideos: JSON.parse(localStorage.getItem('likedVideos')) || [],
    dislikedVideos: JSON.parse(localStorage.getItem('dislikedVideos')) || [],
    historyVideos: JSON.parse(localStorage.getItem('historyVideos')) || [],
    downloadedVideos:
      JSON.parse(localStorage.getItem('downloadedVideos')) || [],
  }

  componentDidUpdate() {
    const {
      savedVideos,
      likedVideos,
      dislikedVideos,
      historyVideos,
      downloadedVideos,
    } = this.state

    localStorage.setItem('savedVideos', JSON.stringify(savedVideos))
    localStorage.setItem('likedVideos', JSON.stringify(likedVideos))
    localStorage.setItem('dislikedVideos', JSON.stringify(dislikedVideos))
    localStorage.setItem('historyVideos', JSON.stringify(historyVideos))
    localStorage.setItem('downloadedVideos', JSON.stringify(downloadedVideos))
  }

  clearHistoryVideos = () => {
    this.setState({historyVideos: []})
  }

  toggleTheme = () => {
    this.setState(prevState => ({isDarkMode: !prevState.isDarkMode}))
  }

  toggleSaveVideo = video => {
    this.setState(prevState => {
      const exists = prevState.savedVideos.find(each => each.id === video.id)

      if (exists) {
        return {
          savedVideos: prevState.savedVideos.filter(
            each => each.id !== video.id,
          ),
        }
      }

      return {
        savedVideos: [video, ...prevState.savedVideos],
      }
    })
  }

  likeVideo = video => {
    this.setState(prevState => {
      const exists = prevState.likedVideos.find(each => each.id === video.id)

      if (exists) {
        return null
      }

      return {
        likedVideos: [video, ...prevState.likedVideos],
        dislikedVideos: prevState.dislikedVideos.filter(
          each => each.id !== video.id,
        ),
      }
    })
  }

  dislikeVideo = video => {
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
        likedVideos: prevState.likedVideos.filter(each => each.id !== video.id),
      }
    })
  }

  removeLike = video => {
    this.setState(prevState => ({
      likedVideos: prevState.likedVideos.filter(each => each.id !== video.id),
    }))
  }

  addToHistory = video => {
    const today = new Date().toDateString()

    this.setState(prevState => {
      const updatedHistory = prevState.historyVideos.filter(
        each => each.video.id !== video.id,
      )

      return {
        historyVideos: [{date: today, video}, ...updatedHistory],
      }
    })
  }

  addToDownloads = video => {
    this.setState(prevState => {
      const exists = prevState.downloadedVideos.find(each => each.id === video.id)

      if (exists) {
        return null
      }

      return {
        downloadedVideos: [video, ...prevState.downloadedVideos],
      }
    })
  }

  removeSavedVideo = id => {
    this.setState(prevState => ({
      savedVideos: prevState.savedVideos.filter(each => each.id !== id),
    }))
  }

  removeDownloadedVideo = id => {
    this.setState(prevState => ({
      downloadedVideos: prevState.downloadedVideos.filter(
        each => each.id !== id,
      ),
    }))
  }

  removeHistoryVideo = id => {
    this.setState(prevState => ({
      historyVideos: prevState.historyVideos.filter(
        each => each.video.id !== id,
      ),
    }))
  }

  removeLikedVideo = id => {
    this.setState(prevState => ({
      likedVideos: prevState.likedVideos.filter(each => each.id !== id),
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
          addToDownloads: this.addToDownloads,
          clearHistoryVideos: this.clearHistoryVideos,
          removeSavedVideo: this.removeSavedVideo,
          removeDownloadedVideo: this.removeDownloadedVideo,
          removeHistoryVideo: this.removeHistoryVideo,
          removeLikedVideo: this.removeLikedVideo,
        }}
      >
        <Switch>
          <Route path="/login" component={Login} />
          <ProtectedRoute exact path="/" component={Home} />
          <ProtectedRoute path="/videos/:id" component={SpecificVideo} />
          <ProtectedRoute path="/trending" component={Trending} />
          <ProtectedRoute path="/gaming" component={Gaming} />
          <ProtectedRoute path="/saved-videos" component={SavingVideos} />
          <ProtectedRoute path="/liked-videos" component={LikedVideos} />
          <ProtectedRoute path="/history" component={History} />
          <ProtectedRoute path="/downloads" component={Downloads} />
          <Route component={NotFound} />
        </Switch>
      </BackgroundContext.Provider>
    )
  }
}

export default App