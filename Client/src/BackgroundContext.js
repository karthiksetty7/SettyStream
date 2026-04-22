import React from 'react'

const BackgroundContext = React.createContext({
  isDarkMode: false,
  savedVideos: [],
  likedVideos: [],
  dislikedVideos: [],
  historyVideos: [],
  toggleTheme: () => {},
  toggleSaveVideo: async () => {},
  likeVideo: () => {},
  dislikeVideo: () => {},
  removeLike: () => {},
  addToHistory: async () => {},
  refreshHistory: async () => {},
  getHistoryVideos: async () => {},
  clearHistoryVideos: async () => {},
  removeSavedVideo: async () => {},
  removeHistoryVideo: async () => {},
  removeLikedVideo: () => {},
  getSavedVideos: async () => {},
  addSavedVideo: async () => {},
})

export default BackgroundContext
