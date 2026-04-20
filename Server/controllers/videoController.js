import Video from '../models/Video.js'

// GET all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()

    return res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}