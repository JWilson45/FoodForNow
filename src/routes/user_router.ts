import { getUsers, test } from '../controllers/user'

export default function userRoutes(app) {

  app.get('/test', test)

  app.get('/users', getUsers)

}
