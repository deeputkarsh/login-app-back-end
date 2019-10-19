import { User } from '../models'
import { createToken, redisClient } from '../config'

export const UserController = {
  signup: async (req, res) => {
    const userInfo = req.body
    const newUser = new User({
      name: userInfo.name,
      email: userInfo.email,
      mobile: userInfo.mobile
    })
    newUser.password = newUser.generateHash(userInfo.password)
    const queryResult = await newUser.save()
    let data
    if (queryResult._id) {
      data = {
        id: queryResult._id,
        name: userInfo.name,
        email: userInfo.email,
        mobile: userInfo.mobile
      }
    } else {
      data = queryResult
    }
    return res.send({ isSuccess: true, data })
  },
  getUserData: async (req, res) => {
    const user = await User.findById(req.userId)
    return res.send({
      isSuccess: true,
      data: {
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    })
  },
  login: async (req, res) => {
    const { mobile, password } = req.body
    const user = await User.findOne({ mobile })
    if (!user) {
      throw new Error("User doesn't exist")
    } else if (!user.validPassword(password)) {
      throw new Error('Invalid Password')
    }
    const token = await createToken(user._id.toString())
    return res.send({ isSuccess: true, token })
  },
  logout: async (req, res) => {
    await redisClient.deleteToken(req.userId)
    return res.send({ isSuccess: true, msg: 'Logged out SuccessFully' })
  },
  updateProfile: async (req, res) => {
    await User.findByIdAndUpdate(req.userId, req.body)
    return res.send({ isSuccess: true, msg: 'Item Updated' })
  }
}
