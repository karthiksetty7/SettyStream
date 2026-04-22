import express from 'express'
import {
  getLikedVideos,
  addLikedVideo,
  removeLikedVideo,
  clearLikedVideos,
} from '../controllers/likedVideoController.js'
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getLikedVideos)
router.post('/', protect, addLikedVideo)
router.delete('/', protect, clearLikedVideos)
router.delete('/:videoId', protect, removeLikedVideo)

export default router
