import Video from '../models/Video.js'

// GET videos by category + optional search
export const getVideos = async (req, res) => {
  try {
    const { category = '', search = '' } = req.query

    const filter = {}

    if (category) {
      filter.category = category
    }

    if (search) {
      filter.title = { $regex: search, $options: 'i' }
    }

    const videos = await Video.find(filter)

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
