import mongoose from 'mongoose'

const savedVideoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    videoId: {
      type: String,
      required: true,
      trim: true,
    },
    video: {
      id: {
        type: String,
        required: true,
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
      video_url: {
        type: String,
        default: '',
        trim: true,
      },
      category: {
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
    },
  },
  {
    timestamps: true,
  }
)

savedVideoSchema.index({userId: 1, videoId: 1}, {unique: true})

const SavedVideo = mongoose.model('SavedVideo', savedVideoSchema)

export default SavedVideo