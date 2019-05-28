import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Routes } from './routes'
import { connectMongo, errorHandler, verifyToken } from './config'

export const initApp = async () => {
  // Initiate express
  const app = express()

  app.use(cors({
    origin: process.env.FRONT_END_URL,
    optionsSuccessStatus: 200
  }))
  // Parse incoming request body
  app.use(bodyParser.json({ limit: '5mb' }))
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: true, parameterLimit: 50 }))

  app.use(verifyToken)

  // Create MongoDB connection
  await connectMongo()

  // Initiate all routes
  Routes(app)

  // Application level error handler
  app.use(errorHandler)
  return app
}
