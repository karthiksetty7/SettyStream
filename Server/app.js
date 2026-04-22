import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import videoRoutes from './routes/videoRoutes.js'
import authRoutes from './routes/authRoutes.js'
import historyRoutes from './routes/historyRoutes.js'
import savedVideoRoutes from './routes/savedVideoRoutes.js'
import likedVideoRoutes from './routes/likedVideoRoutes.js'
import dislikedVideoRoutes from './routes/dislikedVideoRoutes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'SettyStream API is running',
  })
})

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  })
})

app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/saved-videos', savedVideoRoutes)
app.use('/api/liked-videos', likedVideoRoutes)
app.use('/api/disliked-videos', dislikedVideoRoutes)

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

app.use((err, req, res, next) => {
  console.error('App error:', err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

export default app
