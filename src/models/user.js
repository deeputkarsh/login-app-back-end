import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt-nodejs'
import { SCHEMA_NAMES } from '../constants'

const schemaDef = new Schema({
  email: String,
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    max: 100
  },
  mobile: {
    type: Number,
    unique: true
  }
})
// hash the password
schemaDef.methods.generateHash = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

// checking if password is valid
schemaDef.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password)
}

export const User = mongoose.model(SCHEMA_NAMES.USER, schemaDef)
