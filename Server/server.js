import dotenv from 'dotenv'
import app from './app.js'
import connectDB from './config/db.js'

dotenv.config()

const PORT = process.env.PORT || 5000

// connect database FIRST
connectDB()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
