import express from 'express'
import {
  getDislikedVideos,
  toggleDislikedVideo,
  removeDislikedVideo,
  clearDislikedVideos,
} from '../controllers/dislikedVideoController.js'
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getDislikedVideos)
router.post('/', protect, toggleDislikedVideo)
router.delete('/', protect, clearDislikedVideos)
router.delete('/:videoId', protect, removeDislikedVideo)

export default router
