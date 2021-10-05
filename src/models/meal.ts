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

<<<<<<< HEAD
  constructor(_id: string, name: string, description: string,
    recipes: Array<Object>, dateCreated: Date, dateUpdated: Date,
    mealTime: string, owner: ObjectId ) {
=======
  constructor(_id: string, name: string, description: string, recipes: Array<Object>,
    dateCreated: Date, dateUpdated: Date, mealTime: string, owner: ObjectId ) {
>>>>>>> 3fac968820bc843aad6252d0915945c4969ebcb2

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
