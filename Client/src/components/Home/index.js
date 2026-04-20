import { Component } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import Loader from "react-loader-spinner";

import Header from "../Header";
import LeftNavBar from "../LeftNavBar";
import CommonVideosList from "../CommonVideosList";

import BackgroundContext from "../../BackgroundContext";
import { apiRequest } from "../../utils/api";
import logo from "../../SettyStream.png";

import "./index.css";

const apiStatus = {
  INITIAL: "INITIAL",
  LOADING: "LOADING",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

class Home extends Component {
  state = {
    showBanner: true,
    videos: [],
    searchInput: "",
    activeSearch: "",
    status: apiStatus.INITIAL,
  };

  componentDidMount() {
    this.fetchVideos();
  }

  getFormattedVideos = (data) =>
    (data.videos || []).map((video) => ({
      id: video.id,
      title: video.title,
      thumbnailUrl: video.thumbnail_url,
      viewCount: video.view_count,
      publishedAt: video.published_at,
      channel: {
        name: video.channel?.name || "",
        profileImageUrl: video.channel?.profile_image_url || "",
      },
    }));

  fetchVideos = async () => {
    this.setState({ status: apiStatus.LOADING });

    const { activeSearch } = this.state;

    const response = await apiRequest({
      endpoint: `/videos?category=home&search=${encodeURIComponent(activeSearch)}`,
      method: "GET",
      isPublic: true,
    });

    if (!response || response.success === false) {
      this.setState({ status: apiStatus.FAILURE });
      return;
    }

    const updatedVideos = this.getFormattedVideos(response);

    this.setState({
      videos: updatedVideos,
      status: apiStatus.SUCCESS,
    });
  };

  onChangeSearchInput = (event) => {
    this.setState({ searchInput: event.target.value });
  };

  onSearch = () => {
    this.setState(
      (prevState) => ({ activeSearch: prevState.searchInput }),
      this.fetchVideos
    );
  };

  onCloseBanner = () => {
    this.setState({ showBanner: false });
  };

  onKeyDownSearchInput = (event) => {
    if (event.key === "Enter") {
      this.onSearch();
    }
  };

  renderNoVideosView = () => (
    <div className="home-empty">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-no-search-results-img.png"
        alt="no videos"
      />
      <h2>No results found</h2>
      <p>Try different key words or remove search filter</p>
      <button type="button" onClick={this.fetchVideos}>
        Retry
      </button>
    </div>
  );

  renderVideos = () => {
    const { videos } = this.state;

    if (videos.length === 0) {
      return this.renderNoVideosView();
    }

    return (
      <ul className="home-videos-grid">
        {videos.map((video) => (
          <li key={video.id}>
            <CommonVideosList
              eachVideo={video}
              showSaveOption
              showDownloadOption
              showShareOption
              showDeleteOption={false}
            />
          </li>
        ))}
      </ul>
    );
  };

  renderFailureView = (isDarkMode) => (
    <div className={`home-error ${isDarkMode ? "home-error--dark" : ""}`}>
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-watch-failure-view.png"
        alt="failure view"
      />
      <h2>Oops! Something went wrong</h2>
      <p>
        We are having some trouble to complete your request. Please try again.
      </p>
      <button type="button" onClick={this.fetchVideos}>
        Retry
      </button>
    </div>
  );

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

  renderBanner = () => {
    const { showBanner } = this.state;

    if (!showBanner) {
      return null;
    }

    return (
      <div className="home-banner" data-testid="banner">
        <button
          type="button"
          className="home-banner-close"
          onClick={this.onCloseBanner}
          aria-label="close banner"
        >
          <MdClose />
        </button>
        <img src={logo} alt="website logo" className="home-banner-logo" />
        <p className="home-banner-text">Buy Premium prepaid plans with UPI</p>
        <button type="button" className="home-banner-btn">
          GET IT NOW
        </button>
      </div>
    );
  };

  renderSearchBar = () => {
    const { searchInput } = this.state;

    return (
      <div className="home-search">
        <input
          type="search"
          placeholder="Search"
          value={searchInput}
          onChange={this.onChangeSearchInput}
          onKeyDown={this.onKeyDownSearchInput}
        />
        <button
          type="button"
          onClick={this.onSearch}
          data-testid="searchButton"
          aria-label="search"
        >
          <MdSearch />
        </button>
      </div>
    );
  };

  renderSuccessView = () => (
    <>
      {this.renderBanner()}
      {this.renderSearchBar()}
      {this.renderVideos()}
    </>
  );

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
          const homeClassName = `home ${isDarkMode ? "home--dark" : ""}`;

          return (
            <>
              <Header />
              <div className="nav-sections-container">
                <LeftNavBar />
                <main className={homeClassName}>
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

export default Home;
