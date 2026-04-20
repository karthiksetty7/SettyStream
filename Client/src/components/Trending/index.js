import { Component } from "react";
import Cookies from "js-cookie";
import Loader from "react-loader-spinner";
import { FaFire } from "react-icons/fa";

import Header from "../Header";
import LeftNavBar from "../LeftNavBar";
import CommonVideosList from "../CommonVideosList";

import BackgroundContext from "../../BackgroundContext";

import "./index.css";

const apiStatus = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

class Trending extends Component {
  state = {
    videos: [],
    status: apiStatus.INITIAL,
  };

  componentDidMount() {
    this.fetchTrending();
  }

  getFormattedVideos = (data) =>
    data.videos.map((video) => ({
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnail_url,
      viewCount: video.view_count,
      publishedAt: video.published_at,
      channel: {
        name: video.channel.name,
        profileImageUrl: video.channel.profile_image_url,
      },
    }));

  fetchTrending = async () => {
    this.setState({ status: apiStatus.LOADING });

    const jwtToken = Cookies.get("jwt_token");

    try {
      const response = await fetch("https://apis.ccbp.in/videos/trending", {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedVideos = this.getFormattedVideos(data);

        this.setState({
          videos: updatedVideos,
          status: apiStatus.SUCCESS,
        });
      } else {
        this.setState({ status: apiStatus.FAILURE });
      }
    } catch {
      this.setState({ status: apiStatus.FAILURE });
    }
  };

  renderVideos = () => {
    const { videos } = this.state;

    return (
      <ul className="trending-list">
        {videos.map((video) => (
          <CommonVideosList
            eachVideo={video}
            showSaveOption
            showDownloadOption
            showShareOption
            showDeleteOption={false}
          />
        ))}
      </ul>
    );
  };

  renderLoadingView = (isDarkMode) => (
    <div className="loader-container" data-testid="loader">
      <Loader
        type="ThreeDots"
        color={isDarkMode ? "#ffffff" : "#4f46e5"}
        height={50}
        width={50}
      />
    </div>
  );

  renderFailureView = (isDarkMode) => (
    <div
      className={`trending-error ${isDarkMode ? "trending-error--dark" : ""}`}
    >
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view.png"
        alt="failure view"
        className="trending-error-image"
      />
      <h2>Oops! Something went wrong</h2>
      <p>
        We are having some trouble to complete your request. Please try again.
      </p>
      <button type="button" onClick={this.fetchTrending}>
        Retry
      </button>
    </div>
  );

  renderSuccessView = () => <>{this.renderVideos()}</>;

  renderContent = (isDarkMode) => {
    const { status } = this.state;

    switch (status) {
      case apiStatus.LOADING:
        return this.renderLoadingView(isDarkMode);
      case apiStatus.FAILURE:
        return this.renderFailureView(isDarkMode);
      case apiStatus.SUCCESS:
        return this.renderSuccessView();
      default:
        return null;
    }
  };

  render() {
    return (
      <BackgroundContext.Consumer>
        {({ isDarkMode }) => {
          const trendingClassName = `trending ${isDarkMode ? "trending--dark" : ""}`;

          return (
            <>
              <Header />
              <div className="nav-sections-container">
                <LeftNavBar />
                <main className={trendingClassName}>
                  {this.renderContent(isDarkMode)}
                </main>
              </div>
            </>
          );
        }}
      </BackgroundContext.Consumer>
    );
  }
}

export default Trending;
