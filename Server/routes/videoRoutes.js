import express from 'express'
import { getVideos, getVideoById } from '../controllers/videoController.js'

const router = express.Router()

router.get('/', getVideos)
router.get('/:id', getVideoById)  

export default router
