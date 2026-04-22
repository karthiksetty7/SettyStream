import { Component } from "react";
import { Route, Switch } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./components/Login";
import Home from "./components/Home";
import SpecificVideo from "./components/SpecificVideo";
import Trending from "./components/Trending";
import SavingVideos from "./components/SavingVideos";
import Gaming from "./components/Gaming";
import NotFound from "./components/NotFound";
import History from "./components/History";
import LikedVideos from "./components/LikedVideos";
import BackgroundContext from "./BackgroundContext";
import { apiRequest } from "./utils/api";

import "./App.css";

class App extends Component {
  state = {
    isDarkMode: false,
    savedVideos: JSON.parse(localStorage.getItem("savedVideos")) || [],
    likedVideos: JSON.parse(localStorage.getItem("likedVideos")) || [],
    dislikedVideos: JSON.parse(localStorage.getItem("dislikedVideos")) || [],
    historyVideos: [],
  };

  componentDidMount() {
    this.getHistoryVideos();
  }

  componentDidUpdate(prevProps, prevState) {
    const { savedVideos, likedVideos, dislikedVideos } = this.state;

    if (prevState.savedVideos !== savedVideos) {
      localStorage.setItem("savedVideos", JSON.stringify(savedVideos));
    }

    if (prevState.likedVideos !== likedVideos) {
      localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    }

    if (prevState.dislikedVideos !== dislikedVideos) {
      localStorage.setItem("dislikedVideos", JSON.stringify(dislikedVideos));
    }
  }

  getHistoryVideos = async () => {
    const data = await apiRequest({
      endpoint: "/history",
      method: "GET",
    });

    if (data.success === false) {
      return;
    }

    const formattedHistory = (data.historyVideos || []).map((item) => ({
      ...item,
      video: {
        ...item.video,
        thumbnailUrl: item.video.thumbnail_url,
        viewCount: item.video.view_count,
        publishedAt: item.video.published_at,
        videoUrl: item.video.video_url,
        channel: {
          ...item.video.channel,
          profileImageUrl: item.video.channel?.profile_image_url,
        },
      },
    }));

    this.setState({
      historyVideos: formattedHistory,
    });
  };

  clearHistoryVideos = async () => {
    const data = await apiRequest({
      endpoint: "/history",
      method: "DELETE",
    });

    if (data.success === false) {
      return;
    }

    this.setState({ historyVideos: [] });
  };

  toggleTheme = () => {
    this.setState((prevState) => ({ isDarkMode: !prevState.isDarkMode }));
  };

  toggleSaveVideo = (video) => {
    this.setState((prevState) => {
      const exists = prevState.savedVideos.find((each) => each.id === video.id);

      if (exists) {
        return {
          savedVideos: prevState.savedVideos.filter(
            (each) => each.id !== video.id,
          ),
        };
      }

      return {
        savedVideos: [video, ...prevState.savedVideos],
      };
    });
  };

  likeVideo = (video) => {
    this.setState((prevState) => {
      const exists = prevState.likedVideos.find((each) => each.id === video.id);

      if (exists) {
        return null;
      }

      return {
        likedVideos: [video, ...prevState.likedVideos],
        dislikedVideos: prevState.dislikedVideos.filter(
          (each) => each.id !== video.id,
        ),
      };
    });
  };

  dislikeVideo = (video) => {
    this.setState((prevState) => {
      const exists = prevState.dislikedVideos.find(
        (each) => each.id === video.id,
      );

      if (exists) {
        return {
          dislikedVideos: prevState.dislikedVideos.filter(
            (each) => each.id !== video.id,
          ),
        };
      }

      return {
        dislikedVideos: [...prevState.dislikedVideos, video],
        likedVideos: prevState.likedVideos.filter(
          (each) => each.id !== video.id,
        ),
      };
    });
  };

  removeLike = (video) => {
    this.setState((prevState) => ({
      likedVideos: prevState.likedVideos.filter((each) => each.id !== video.id),
    }));
  };

  addToHistory = async (video) => {
    const data = await apiRequest({
      endpoint: "/history",
      method: "POST",
      body: video,
    });

    if (data.success === false || !data.historyVideo) {
      console.error("Failed to add history:", data);
      return;
    }

    const item = data.historyVideo;

    const formattedHistoryItem = {
      ...item,
      video: {
        ...item.video,
        thumbnailUrl: item.video.thumbnail_url,
        viewCount: item.video.view_count,
        publishedAt: item.video.published_at,
        videoUrl: item.video.video_url,
        channel: {
          ...item.video.channel,
          profileImageUrl: item.video.channel?.profile_image_url,
        },
      },
    };

    this.setState((prevState) => {
      const filteredHistory = prevState.historyVideos.filter(
        (each) => each.videoId !== formattedHistoryItem.videoId,
      );

      return {
        historyVideos: [formattedHistoryItem, ...filteredHistory],
      };
    });
  };

  refreshHistory = async () => {
    await this.getHistoryVideos();
  };

  removeSavedVideo = (id) => {
    this.setState((prevState) => ({
      savedVideos: prevState.savedVideos.filter((each) => each.id !== id),
    }));
  };

  removeHistoryVideo = async (videoId) => {
    const data = await apiRequest({
      endpoint: `/history/${videoId}`,
      method: "DELETE",
    });

    if (data.success === false) {
      return;
    }

    this.setState((prevState) => ({
      historyVideos: prevState.historyVideos.filter(
        (each) => each.videoId !== videoId,
      ),
    }));
  };

  removeLikedVideo = (id) => {
    this.setState((prevState) => ({
      likedVideos: prevState.likedVideos.filter((each) => each.id !== id),
    }));
  };

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
    );
  }
}

export default App;
