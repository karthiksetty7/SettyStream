// models/Video.js
import mongoose from 'mongoose'

const videoSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    thumbnail_url: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      name: {
        type: String,
        default: '',
        trim: true,
      },
      profile_image_url: {
        type: String,
        default: '',
        trim: true,
      },
    },
    view_count: {
      type: String,
      required: true,
      trim: true,
    },
    published_at: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['home', 'trending', 'gaming'],
    },
  },
  { timestamps: true }
)

const Video = mongoose.model('Video', videoSchema)

export default Video
