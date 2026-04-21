import Video from '../models/Video.js'

const escapeRegex = value =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// GET videos by category + optional search
export const getVideos = async (req, res) => {
  try {
    const {category = '', search = ''} = req.query

    const filter = {}

    if (category) {
      filter.category = category
    }

    if (search.trim()) {
      filter.title = {
        $regex: escapeRegex(search.trim()),
        $options: 'i',
      }
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

// GET single video by custom id
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Video id is required",
      });
    }

    const video = await Video.findOne({ id: id.trim() }).lean();

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      video,
    });

  } catch (error) {
    console.error("getVideoById error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
