import React from "react";

const BackgroundContext = React.createContext({
  isDarkMode: false,
  savedVideos: [],
  likedVideos: [],
  dislikedVideos: [],
  historyVideos: [],
  downloadedVideos: [],
  toggleTheme: () => {},
  toggleSaveVideo: () => {},
  likeVideo: () => {},
  dislikeVideo: () => {},
  removeLike: () => {},
  addToHistory: () => {},
  addToDownloads: () => {},
  clearHistoryVideos: () => {},
  removeSavedVideo: () => {},
  removeDownloadedVideo: () => {},
  removeHistoryVideo: () => {},
  removeLikedVideo: () => {},
});

export default BackgroundContext;
