import { ObjectId } from "mongodb";
import Ingredient from './ingredient'

// Interface that extends ingredient so we can store all ingredient data and
// amount + unit in the ingredients key value pair
interface RecipeIngredients extends Ingredient {
  amount: string
  unit: string
}

class Recipe {
  _id: ObjectId;
  owner: ObjectId;
  name: string;
  alias: string;
  description: string;
  instructions: Array<string>;
  ingredients: Array<RecipeIngredients>;
  isPublic: boolean;
  dateCreated: Date;
  dateUpdated: Date;
  type: string;
  mealTime: string;


  constructor(_id: string, owner: string, name: string, alias: string,
    description: string, instructions: Array<string>,
    ingredients: Array<RecipeIngredients>, isPublic: boolean,dateCreated: Date,
    dateUpdated: Date, type: string, mealTime: string) {

    // Create a new objectid object from a string... good for code reuse
    this._id = new ObjectId(_id)
    this.owner = new ObjectId(owner)
    this.name = name
    this.alias = alias
    this.description = description
    this.instructions = instructions
    this.ingredients = ingredients
    this.isPublic = isPublic
    this.dateCreated = dateCreated
    this.dateUpdated = dateUpdated
    this.type = type
    this.mealTime = mealTime
  }

}

export default Recipe
