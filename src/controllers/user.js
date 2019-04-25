import { User } from '../models'

export const UserController = {
  signup: async (req, res) => {
    const userInfo = req.body
    let newUser = new User({
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
    const { id } = req.body
    const user = await User.findById(id)
    return res.send({
      isSuccess: true,
      data: {
        id: user._id,
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
    return res.send({
      isSuccess: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile
      }
    })
  },
  updateProfile: async (req, res) => {
    const { id } = req.body
    const queryResult = await User.findByIdAndUpdate(id, req.body)
    return res.send({ isSuccess: true, data: { msg: 'Item Updated', queryResult } })
  }
}
