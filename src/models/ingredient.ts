import { ObjectId } from "mongodb";

class Ingredient {
  _id: ObjectId;
  name: string;
  //image: image,
  description: string;
  calories: number;

  constructor(_id: string, name: string, description: string, calories: number) {

    // Create a new objectid object from a string... good for code reuse
    this._id = new ObjectId(_id)
    this.name = name
    this.description = description
    this.calories = calories

  }

}

export default Ingredient
