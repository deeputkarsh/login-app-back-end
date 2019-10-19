import express from 'express'

const router = express.Router()

// Version Route
router.get('/version', (req, res, next) => {
  const version = process.env.npm_package_version
  return res.json({ version })
})

// Health check route
router.get('/health-check', (req, res, next) => {
  return res.json({ message: 'Healthy!!' })
})

export default router
