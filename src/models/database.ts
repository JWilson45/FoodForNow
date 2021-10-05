import { MongoClient } from 'mongodb'
// Connection URI
const uri: string =
  `mongodb+srv://${process.env.DATABASE_USERNAME}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_LOCATION}`

console.log(uri);

// Create a new MongoClient
const client = new MongoClient(uri);
export default async function run(command: Function) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const database = client.db('foodfornow');

    const collections = {
      ingredient: database.collection('Ingredient'),
      groceries: database.collection('Ingredient'),
      meal: database.collection('Meal'),
      recipe: database.collection('Recipe'),
      user: database.collection('User')
    }

    return await command(collections)

  } catch (error) {
    console.error(error)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
    console.log("Connection Closed");

  }
}




// import Mongoose from "mongoose";
// // import { UserModel } from "./users/users.model";
// let database: Mongoose.Connection;
// export const connect = () => {
//   // add your own uri below
//   const uri = "mongodb+srv://<username>:<password>@cluster0-v6q0g.mongodb.net/test?retryWrites=true&w=majority";
//   if (database) {
//     return;
//   }
//   Mongoose.connect(uri, {
//     useNewUrlParser: true,
//     useFindAndModify: true,
//     useUnifiedTopology: true,
//     useCreateIndex: true,
//   });
//   database = Mongoose.connection;
//   database.once("open", async () => {
//     console.log("Connected to database");
//   });
//   database.on("error", () => {
//     console.log("Error connecting to database");
//   });
// };
// export const disconnect = () => {
//   if (!database) {
//     return;
//   }
//   Mongoose.disconnect();
// };
