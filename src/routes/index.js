import UserRouter from './user'
import { httpStatus } from '../constants'

const RouteData = [ { path: '/', router: UserRouter } ]

export const Routes = (app) => {
  // Setting application routes
  // app.get('/', (req, res) => res.redirect(config.frontEndUrl))

  RouteData.forEach((route) => app.use(route.path, route.router))

  // Version Route
  app.get('/api/version', (req, res, next) => {
    return res.json({ statusCode: httpStatus.OK, message: 'OK', data: process.env.APP_VERSION })
  })

  // Health check route
  app.get('/api/health-check', (req, res, next) => {
    return res.json({ statusCode: httpStatus.OK, message: 'OK' })
  })

  // If not found 404 route
  app.use(function (req, res, next) {
    return res.status(httpStatus.NOT_FOUND).json({ statusCode: httpStatus.NOT_FOUND, message: 'No route found' })
  })
}
