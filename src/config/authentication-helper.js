import jsonwebtoken from 'jsonwebtoken'
import { JWT_CONFIG } from './environment'
import { redisClient } from './redis-client'

export const createToken = (id) => {
  return jsonwebtoken.sign({ id }, JWT_CONFIG.SECERET, { expiresIn: JWT_CONFIG.TOKEN_VALIDITY })
}

export const isJWTRevoked = async (req, payload, done) => {
  const token = req.headers.authorization.replace('Bearer ', '')
  const isRevoked = await redisClient.get(token).catch(_ => done(null, false))
  done(null, !!isRevoked)
}

export const getLoginfromHeader = ({ authorization = '' }) => {
  const authData = authorization.replace('Basic ', '')
  const [mobile, password] = Buffer.from(authData, 'base64').toString().split(':')
  return { mobile, password }
}
