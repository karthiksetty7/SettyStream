import LikedVideo from '../models/LikedVideo.js'

export const getLikedVideos = async (req, res) => {
  try {
    const likedVideos = await LikedVideo.find({userId: req.user.id})
      .sort({createdAt: -1})
      .lean()

    return res.status(200).json({
      success: true,
      likedVideos: likedVideos.map(item => ({
        id: item._id,
        videoId: item.videoId,
        video: item.video,
      })),
    })
  } catch (error) {
    console.error('GET LIKED VIDEOS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch liked videos',
    })
  }
}

export const addLikedVideo = async (req, res) => {
  try {
    const video = req.body

    if (!video?.id || !video?.title || !video?.thumbnail_url) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video data',
      })
    }

    const likedVideo = await LikedVideo.findOneAndUpdate(
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
      message: 'Video liked successfully',
      likedVideo: {
        id: likedVideo._id,
        videoId: likedVideo.videoId,
        video: likedVideo.video,
      },
    })
  } catch (error) {
    console.error('ADD LIKED VIDEO ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to like video',
    })
  }
}

export const removeLikedVideo = async (req, res) => {
  try {
    const {videoId} = req.params

    const deletedVideo = await LikedVideo.findOneAndDelete({
      userId: req.user.id,
      videoId,
    })

    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Liked video not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Liked video removed successfully',
    })
  } catch (error) {
    console.error('REMOVE LIKED VIDEO ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to remove liked video',
    })
  }
}

export const clearLikedVideos = async (req, res) => {
  try {
    await LikedVideo.deleteMany({userId: req.user.id})

    return res.status(200).json({
      success: true,
      message: 'Liked videos cleared successfully',
    })
  } catch (error) {
    console.error('CLEAR LIKED VIDEOS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to clear liked videos',
    })
  }
}
