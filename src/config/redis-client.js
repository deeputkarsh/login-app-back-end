import redis from 'redis'
import debug from 'debug'

const log = debug('app')

const client = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST)

client.on('connect', function () {
  log('Redis client connected')
})
client.on('error', function (err) {
  log('Something went wrong ' + err)
})

export default {
  saveToken: (key, value) => {
    return new Promise((resolve, reject) => {
      client.set(key, value, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  },
  getToken: (key) => {
    return new Promise((resolve, reject) => {
      client.get(key, function (error, result) {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  },
  deleteToken: async (key) => {
    return new Promise((resolve, reject) => {
      client.del(key, (error, result) => {
        if (error) {
          return reject(error)
        }
        resolve(result)
      })
    })
  }
}
