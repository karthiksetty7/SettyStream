import User from '../models/User.js'
import generateToken from '../utils/generateToken.js'

export const registerUser = async (req, res) => {
  try {
    const name = req.body.name?.trim()
    const username = req.body.username?.trim().toLowerCase()
    const email = req.body.email?.trim().toLowerCase()
    const password = req.body.password?.trim()

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, username, email, and password are required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      })
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists with this email or username',
      })
    }

    const user = await User.create({
      name,
      username,
      email,
      password,
    })

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('REGISTER ERROR FULL:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Registration failed due to server error',
    })
  }
}

export const loginUser = async (req, res) => {
  try {
    const loginId = req.body.loginId?.trim().toLowerCase()
    const password = req.body.password?.trim()

    if (!loginId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username/email and password are required',
      })
    }

    const user = await User.findOne({
      $or: [{ email: loginId }, { username: loginId }],
    })

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password',
      })
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username/email or password',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error('LOGIN ERROR FULL:', error)
    return res.status(500).json({
      success: false,
      message: error.message || 'Login failed due to server error',
    })
  }
}
