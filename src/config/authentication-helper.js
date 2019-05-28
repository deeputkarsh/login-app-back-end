import jsonwebtoken from 'jsonwebtoken'
import redisClient from './redis-client'

const JWT_CONFIG = {
  secret: process.env.JWT_SECERET,
  authenticationNotRequiredAPIs: [
    '/signup',
    '/login'
  ],
  getAuthenticationNotRequiredAPIs: (path) => {
    let result = JWT_CONFIG.authenticationNotRequiredAPIs.filter(elem => (path.search(elem) > -1))
    return !!result.length
  }
}

export const verifyToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'] // Express headers are auto converted to lowercase

  if (!req.user && JWT_CONFIG.getAuthenticationNotRequiredAPIs(req.path)) {
    next()
  } else {
    const tokenResp = await tokenHandling(token)
    if (tokenResp.isSuccess === false) {
      return res.json(tokenResp)
    } else {
      req.userId = tokenResp.user
      const redisToken = await redisClient.getToken(req.userId)
      if (redisToken) {
        next()
      } else {
        return res.status(401).json({ isSuccess: false, message: 'token expired' })
      }
    }
  }
}

export const createToken = async (userId) => {
  const token = jsonwebtoken.sign({ user: userId }, process.env.JWT_SECERET, { expiresIn: 86400 })
  await redisClient.saveToken(userId, token)
  return token
}
const tokenHandling = async (token) => {
  if (token) {
    if (token.startsWith('Bearer ')) {
      // Remove Bearer from string
      token = token.slice(7, token.length)
    }
    try {
      const decoded = await jsonwebtoken.verify(token, JWT_CONFIG.secret)
      return decoded
    } catch (error) {
      return {
        isSuccess: false,
        message: 'Token is not valid'
      }
    }
  } else {
    return {
      isSuccess: false,
      message: 'Auth token is not supplied'
    }
  }
}
