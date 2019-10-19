import express from 'express'
import { UserController } from '../controllers'
import { asyncMiddleware } from '../utils'
const router = express.Router()

router.post('/signup', asyncMiddleware(UserController.signup))
router.get('/', asyncMiddleware(UserController.getUserData))
router.get('/logout', asyncMiddleware(UserController.logout))
router.post('/login', asyncMiddleware(UserController.login))
router.post('/updateProfile', asyncMiddleware(UserController.updateProfile))

export default router
