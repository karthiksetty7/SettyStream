import History from '../models/History.js'

const getHistoryVideos = async (req, res) => {
  try {
    const historyVideos = await History.find({ userId: req.user.id })
      .sort({ watchedAt: -1 })
      .lean()

    res.status(200).json({
      historyVideos: historyVideos.map(item => ({
        id: item._id,
        videoId: item.videoId,
        video: item.video,
        watchedAt: item.watchedAt,
      })),
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch history videos' })
  }
}

const addHistoryVideo = async (req, res) => {
  try {
    const video = req.body

    if (!video?.id || !video?.title || !video?.thumbnail_url) {
      return res.status(400).json({ message: 'Invalid video data' })
    }

    const historyVideo = await History.findOneAndUpdate(
      { userId: req.user.id, videoId: video.id },
      {
        $set: {
          userId: req.user.id,
          videoId: video.id,
          video,
          watchedAt: new Date(),
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    res.status(200).json({
      message: 'History updated successfully',
      historyVideo: {
        id: historyVideo._id,
        videoId: historyVideo.videoId,
        video: historyVideo.video,
        watchedAt: historyVideo.watchedAt,
      },
    })
  } catch (error) {
    res.status(500).json({ message: 'Failed to save history video' })
  }
}

const removeHistoryVideo = async (req, res) => {
  try {
    const { videoId } = req.params

    const deletedVideo = await History.findOneAndDelete({
      userId: req.user.id,
      videoId,
    })

    if (!deletedVideo) {
      return res.status(404).json({ message: 'History video not found' })
    }

    res.status(200).json({ message: 'History video removed successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to remove history video' })
  }
}

const clearHistoryVideos = async (req, res) => {
  try {
    await History.deleteMany({ userId: req.user.id })
    res.status(200).json({ message: 'History cleared successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear history' })
  }
}

export {
  getHistoryVideos,
  addHistoryVideo,
  removeHistoryVideo,
  clearHistoryVideos,
}