import express from 'express'
import {
  getSavedVideos,
  addSavedVideo,
  removeSavedVideo,
  clearSavedVideos,
} from '../controllers/savedVideoController.js'
import {protect} from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getSavedVideos)
router.post('/', protect, addSavedVideo)
router.delete('/', protect, clearSavedVideos)
router.delete('/:videoId', protect, removeSavedVideo)

export default router
