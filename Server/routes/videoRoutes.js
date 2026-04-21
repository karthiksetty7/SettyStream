import express from 'express'
import {getVideos, getVideoById} from '../controllers/videoController.js'

const router = express.Router()

router.get('/', getVideos)
router.get('/:id', (req, res) => {
  console.log("🔥 ROUTE WORKS:", req.params.id)

  res.json({
    success: true,
    id: req.params.id,
  })
})

export default router
