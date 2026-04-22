import jwt from 'jsonwebtoken'

export const protect = (request, response, next) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({
      success: false,
      message: 'Authorization header missing or invalid',
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'JWT token missing',
    })
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET || 'MY_SECRET_TOKEN',
    (error, payload) => {
      if (error) {
        return response.status(401).json({
          success: false,
          message: 'Invalid access token',
        })
      }

      request.user = payload
      next()
    },
  )
}

export const authenticateToken = protect
