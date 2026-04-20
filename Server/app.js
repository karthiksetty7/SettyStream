import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

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
