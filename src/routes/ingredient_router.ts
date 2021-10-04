import { getIngredient, test } from '../controllers/ingredient'

export default function ingredientRoutes(app) {

  app.get('/test', test)

  app.get('/ingredient', getIngredient)

}
