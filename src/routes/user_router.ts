import { getUser, createNewUser } from '../controllers/user'

export default function userRoutes(app) {

  app.route('/user')
  .get(getUser)
  .post(createNewUser)

}
