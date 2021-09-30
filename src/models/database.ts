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

const { MongoClient } = require("mongodb");
// Connection URI
const uri: string =
  "mongodb+srv://node:node@foodfornow.7xizm.mongodb.net?retryWrites=true&writeConcern=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
export default async function run(command: Function, res: any) {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    const database = client.db('foodfornow');

    // const collections = {
    //   ingredient: database.collection('Ingredient'),
    //   groceries: database.collection('Ingredient'),
    //   meal: database.collection('meal'),
    //   recipe: database.collection('Recipe'),
    //   user: database.collection('User')
    // }


    const usercollection = database.collection('User');


    const result = await usercollection.find({}).toArray()

    res.send(result)

    //   (err, result) => {
    //
    //   // if (err) {
    //   //   res.sendStatus(500)
    //   //   console.error(err)
    //   // } else {
    //   //   res.send(result)
    //   // }
    // })

    // command(collections)

    console.log("Connected successfully to server");

  } catch(error) {
    console.error(error)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
