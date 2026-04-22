import express from 'express'
import {
  getHistoryVideos,
  addHistoryVideo,
  removeHistoryVideo,
  clearHistoryVideos,
} from '../controllers/historyController.js'
import { protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.get('/', protect, getHistoryVideos)
router.post('/', protect, addHistoryVideo)
router.delete('/clear', protect, clearHistoryVideos)
router.delete('/:videoId', protect, removeHistoryVideo)

export default router
