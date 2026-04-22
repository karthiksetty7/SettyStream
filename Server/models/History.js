import mongoose from 'mongoose'

const historySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    videoId: {
      type: String,
      required: [true, 'Video ID is required'],
      trim: true,
    },
    video: {
      id: {
        type: String,
        required: [true, 'Video id is required'],
        trim: true,
      },
      title: {
        type: String,
        required: [true, 'Video title is required'],
        trim: true,
      },
      thumbnail_url: {
        type: String,
        required: [true, 'Thumbnail URL is required'],
        trim: true,
      },
      view_count: {
        type: String,
        default: '',
        trim: true,
      },
      published_at: {
        type: String,
        default: '',
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
      category: {
        type: String,
        default: '',
        trim: true,
      },
      video_url: {
        type: String,
        default: '',
        trim: true,
      },
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

historySchema.index({ userId: 1, videoId: 1 }, { unique: true })

const History = mongoose.model('History', historySchema)

export default History