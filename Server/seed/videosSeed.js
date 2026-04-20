import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Video from '../models/Video.js'
import obj from '../homeapidata.js' // your file

dotenv.config()

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  console.log('MongoDB connected')
}

const seedVideos = async () => {
  try {
    await connectDB()

    await Video.deleteMany() // clear old data

    await Video.insertMany(obj.videos)

    console.log('60 videos inserted successfully 🚀')

    process.exit()
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

seedVideos()