import DislikedVideo from '../models/DislikedVideo.js'
import LikedVideo from '../models/LikedVideo.js'

export const getDislikedVideos = async (req, res) => {
  try {
    const dislikedVideos = await DislikedVideo.find({userId: req.user.id})
      .sort({createdAt: -1})
      .lean()

    return res.status(200).json({
      success: true,
      dislikedVideos: dislikedVideos.map(item => ({
        id: item._id,
        videoId: item.videoId,
        video: item.video,
      })),
    })
  } catch (error) {
    console.error('GET DISLIKED VIDEOS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch disliked videos',
    })
  }
}

export const toggleDislikedVideo = async (req, res) => {
  try {
    const video = req.body

    if (!video?.id || !video?.title || !video?.thumbnail_url) {
      return res.status(400).json({
        success: false,
        message: 'Invalid video data',
      })
    }

    const existingDislikedVideo = await DislikedVideo.findOne({
      userId: req.user.id,
      videoId: video.id,
    })

    if (existingDislikedVideo) {
      await DislikedVideo.deleteOne({
        userId: req.user.id,
        videoId: video.id,
      })

      return res.status(200).json({
        success: true,
        action: 'removed',
        message: 'Disliked video removed successfully',
      })
    }

    await LikedVideo.deleteOne({
      userId: req.user.id,
      videoId: video.id,
    })

    const dislikedVideo = await DislikedVideo.create({
      userId: req.user.id,
      videoId: video.id,
      video,
    })

    return res.status(200).json({
      success: true,
      action: 'added',
      message: 'Video disliked successfully',
      dislikedVideo: {
        id: dislikedVideo._id,
        videoId: dislikedVideo.videoId,
        video: dislikedVideo.video,
      },
    })
  } catch (error) {
    console.error('TOGGLE DISLIKED VIDEO ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle disliked video',
    })
  }
}

export const removeDislikedVideo = async (req, res) => {
  try {
    const {videoId} = req.params

    const deletedVideo = await DislikedVideo.findOneAndDelete({
      userId: req.user.id,
      videoId,
    })

    if (!deletedVideo) {
      return res.status(404).json({
        success: false,
        message: 'Disliked video not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Disliked video removed successfully',
    })
  } catch (error) {
    console.error('REMOVE DISLIKED VIDEO ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to remove disliked video',
    })
  }
}

export const clearDislikedVideos = async (req, res) => {
  try {
    await DislikedVideo.deleteMany({userId: req.user.id})

    return res.status(200).json({
      success: true,
      message: 'Disliked videos cleared successfully',
    })
  } catch (error) {
    console.error('CLEAR DISLIKED VIDEOS ERROR:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to clear disliked videos',
    })
  }
}
