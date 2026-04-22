import React from 'react'

const BackgroundContext = React.createContext({
  isDarkMode: false,
  savedVideos: [],
  likedVideos: [],
  dislikedVideos: [],
  historyVideos: [],
  toggleTheme: () => {},
  toggleSaveVideo: () => {},
  likeVideo: () => {},
  dislikeVideo: () => {},
  removeLike: () => {},
  addToHistory: async () => {},
  getHistoryVideos: async () => {},
  clearHistoryVideos: async () => {},
  removeSavedVideo: () => {},
  removeHistoryVideo: async () => {},
  removeLikedVideo: () => {},
})

export default BackgroundContext
