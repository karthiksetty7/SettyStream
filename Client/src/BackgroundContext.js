import React from 'react'

const BackgroundContext = React.createContext({
  isDarkMode: false,
  savedVideos: [],
  likedVideos: [],
  dislikedVideos: [],
  historyVideos: [],
  toggleTheme: () => {},
  toggleSaveVideo: async () => {},
  likeVideo: async () => {},
  dislikeVideo: async () => {},
  removeLike: async () => {},
  addToHistory: async () => {},
  refreshHistory: async () => {},
  getHistoryVideos: async () => {},
  clearHistoryVideos: async () => {},
  removeSavedVideo: async () => {},
  removeHistoryVideo: async () => {},
  removeLikedVideo: async () => {},
  removeDislikedVideo: async () => {},
  getSavedVideos: async () => {},
  addSavedVideo: async () => {},
  getLikedVideos: async () => {},
  addLikedVideo: async () => {},
  getDislikedVideos: async () => {},
  toggleDislikedVideo: async () => {},
})

export default BackgroundContext
