import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    title: String,
    thumbnail_url: String,
    channel: {
      name: String,
      profile_image_url: String,
    },
    view_count: String,
    published_at: String,
  },
  { timestamps: true }
)

const Video = mongoose.model('Video', videoSchema)

export default Video