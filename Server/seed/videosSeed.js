// seeds/videoSeeder.js
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Video from '../models/Video.js'

import home_api_data_obj from '../homeapidata.js'
import trending_api_data_obj from '../trendingapidata.js'
import gaming_api_data_obj from '../gamingapidata.js'

dotenv.config()

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')
}

const seedVideos = async () => {
  try {
    await connectDB()

    const allVideos = [
      ...home_api_data_obj.videos,
      ...trending_api_data_obj.videos,
      ...gaming_api_data_obj.videos,
    ]

    await Video.deleteMany({})
    await Video.insertMany(allVideos)

    console.log(`${allVideos.length} videos inserted successfully 🚀`)
    process.exit()
  } catch (error) {
    console.error('Seeder error:', error)
    process.exit(1)
  }
}

seedVideos()