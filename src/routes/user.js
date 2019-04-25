import express from 'express'
import { UserController } from '../controllers'
import { asyncMiddleware } from '../utils'
const router = express.Router()

router.post('/signup', asyncMiddleware(UserController.signup))
router.get('/getUserData', asyncMiddleware(UserController.getUserData))
router.all('/login', asyncMiddleware(UserController.login))
router.post('/updateProfile', asyncMiddleware(UserController.updateProfile))

export default router
