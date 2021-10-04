import { getMeal, test } from '../controllers/meal'

export default function mealRoutes(app) {

  app.get('/test', test)

  app.get('/meal', getMeal)

}
