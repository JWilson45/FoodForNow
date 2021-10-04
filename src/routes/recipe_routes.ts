import { getRecipe, test } from '../controllers/recipe'

export default function ingredientRoutes(app) {

  app.get('/test', test)

  app.get('/recipe', getRecipe)

}
