import UserRouter from './user'
import VersionHealthRouter from './version_health'
import { httpStatus } from '../constants'

const RouteData = [
  { path: '/user', router: UserRouter },
  { path: '/api', router: VersionHealthRouter }
]

export const Routes = (app) => {
  // Setting application routes

  RouteData.forEach((route) => app.use(route.path, route.router))

  // If not found 404 route
  app.use(function (req, res, next) {
    return res.status(httpStatus.NOT_FOUND).json({ statusCode: httpStatus.NOT_FOUND, message: 'No route found' })
  })
}
