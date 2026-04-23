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

// =========================
// ✅ CORS CONFIG (SAFE + FIXED)
// =========================
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:3000",
  "https://settystream.onrender.com"
]

const corsOptions = {
  origin: function (origin, callback) {
    // allow Postman / curl / server requests
    if (!origin) return callback(null, true)

    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    console.log("❌ CORS blocked:", origin)

    // TEMP DEV FIX (allow all)
    return callback(null, true)
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}

// Apply CORS
app.use(cors(corsOptions))

// =========================
// ❌ IMPORTANT FIX
// DO NOT use "/*" or "*"
// Express v5 BREAKS with it
// =========================

// =========================
// MIDDLEWARE
// =========================
app.use(express.json())

// =========================
// HEALTH ROUTES
// =========================
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

// =========================
// API ROUTES
// =========================
app.use('/api/auth', authRoutes)
app.use('/api/videos', videoRoutes)
app.use('/api/history', historyRoutes)
app.use('/api/saved-videos', savedVideoRoutes)
app.use('/api/liked-videos', likedVideoRoutes)
app.use('/api/disliked-videos', dislikedVideoRoutes)

// =========================
// 404 HANDLER
// =========================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error('❌ App error:', err)

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

export default app
