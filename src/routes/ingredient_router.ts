import { getIngredient } from '../controllers/ingredient'

const ROUTE = "/ingredients"

export default function ingredientRoutes(app) {

  app.get(ROUTE, getIngredient)
  // app.post(ROUTE, createIngredient)

}
