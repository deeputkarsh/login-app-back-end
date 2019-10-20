import { User } from '../models'
import { createToken, redisClient, getLoginfromHeader } from '../config'
import { AppError } from '../utils'
import { httpStatus } from '../constants'

export const UserController = {
  signup: async (req, res) => {
    const { name, email, mobile, password } = req.body
    const newUser = new User({ name, email, mobile })
    newUser.password = newUser.generateHash(password)
    await newUser.save()
    return res.json({ message: 'User successfully created' })
  },
  getUserData: async (req, res) => {
    const user = await User.findById(req.user.id, 'name email mobile -_id')
    return res.json({ user })
  },
  login: async (req, res) => {
    const { mobile, password } = getLoginfromHeader(req.headers)
    const user = await User.findOne({ mobile })
    if (!user) {
      throw new AppError("User doesn't exist", httpStatus.UNAUTHORIZED)
    } else if (!user.validPassword(password)) {
      throw new AppError('Invalid Password', httpStatus.UNAUTHORIZED)
    }
    const token = await createToken(user._id.toString())
    res.setHeader('x-access-token', token)
    return res.json({ message: 'Logged in SuccessFully' })
  },
  logout: async (req, res) => {
    const token = req.headers.authorization.replace('Bearer ', '')
    const timeToExpire = req.user.exp * 1000 - Date.now()
    await redisClient.set(token, 'revoked', timeToExpire)
    return res.json({ message: 'Logged out SuccessFully' })
  },
  updateProfile: async (req, res) => {
    await User.findByIdAndUpdate(req.user.id, req.body)
    return res.json({ message: 'Profile Updated' })
  }
}
