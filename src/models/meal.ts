import { ObjectId } from "mongodb";

class Meal {
  _id: ObjectId;
  name: string;
  description: string;
  recipes: Array<Object>;
  dateCreated: Date;
  dateUpdated: Date;
  mealTime: string;
  owner: ObjectId

  constructor(_id: string, name: string, description: string, recipes: Array<Object>, dateCreated: Date, dateUpdated: Date, mealTime: string, owner: ObjectId ) {

    // Create a new objectid object from a string... good for code reuse
    this._id = new ObjectId(_id)
    this.name = name
    this.description = description
    this.recipes = recipes
    this.dateCreated = dateCreated
    this.dateUpdated = dateUpdated
    this.mealTime = mealTime
    this.owner = owner

  }

}

export default Meal
