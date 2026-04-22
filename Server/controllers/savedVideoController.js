import SavedVideo from '../models/SavedVideo.js'

export const getSavedVideos = async (req, res) => {
  try {
    const savedVideos = await SavedVideo.find({userId: req.user.id})
      .sort({createdAt: -1})
      .lean()

    return res.status(200).json({
      success: true,
      savedVideos: savedVideos.map(item => ({
        id: item._id,
        videoId: item.videoId,
        video: item.video,
      })),
    })
  } catch (error) {
    console.error('GET SAVED VIDEOS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch saved videos',
    })
  }
}

export const addSavedVideo = async (req, res) => {
  try {
    const video = req.body

    if (!video?.id || !video?.title || !video?.thumbnail_url) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video data',
      })
    }

    const savedVideo = await SavedVideo.findOneAndUpdate(
      {
        userId: req.user.id,
        videoId: video.id,
      },
      {
        $set: {
          userId: req.user.id,
          videoId: video.id,
          video,
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    )

    return res.status(200).json({
      success: true,
      message: 'Video saved successfully',
      savedVideo: {
        id: savedVideo._id,
        videoId: savedVideo.videoId,
        video: savedVideo.video,
      },
    })
  } catch (error) {
    console.error('ADD SAVED VIDEO ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to save video',
    })
  }
}

export const removeSavedVideo = async (req, res) => {
  try {
    const {videoId} = req.params

    const deletedVideo = await SavedVideo.findOneAndDelete({
      userId: req.user.id,
      videoId,
    })

    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Saved video not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Saved video removed successfully',
    })
  } catch (error) {
    console.error('REMOVE SAVED VIDEO ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to remove saved video',
    })
  }
}

export const clearSavedVideos = async (req, res) => {
  try {
    await SavedVideo.deleteMany({userId: req.user.id})

    return res.status(200).json({
      success: true,
      message: 'Saved videos cleared successfully',
    })
  } catch (error) {
    console.error('CLEAR SAVED VIDEOS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to clear saved videos',
    })
  }
}
