import jsonwebtoken from 'jsonwebtoken'
// import { redisClient } from './redis-client'
import { JWT_CONFIG } from './environment'

export const createToken = async (id) => {
  const token = jsonwebtoken.sign({ id }, JWT_CONFIG.SECERET, { expiresIn: JWT_CONFIG.TOKEN_VALIDITY })
  // await redisClient.set(id, token)
  return token
}

export const getLoginfromHeader = ({ authorization = '' }) => {
  const authData = authorization.replace('Basic ', '')
  const [mobile, password] = Buffer.from(authData, 'base64').toString().split(':')
  return { mobile, password }
}
