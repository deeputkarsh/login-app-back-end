import redis from 'redis'
import debug from 'debug'
import { REDIS_URL } from './environment'

const log = debug('app')

const client = redis.createClient(REDIS_URL)

client.on('connect', function () {
  log('Redis client connected')
})
client.on('error', function (err) {
  log('Something went wrong ' + err)
})

export const redisClient = {
  set: (key, value, expiry) => new Promise((resolve, reject) => {
    client.set(key, value, 'PX', expiry, (error, result) => {
      if (error) {
        return reject(error)
      }
      resolve(result)
    })
  }),
  get: (key) => new Promise((resolve, reject) => {
    client.get(key, function (error, result) {
      if (error) {
        return reject(error)
      }
      resolve(result)
    })
  })
}
