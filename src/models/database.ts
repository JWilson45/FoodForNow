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
const uri =
  "mongodb+srv://node:node@foodfornow.7xizm.mongodb.net/foodfornow?retryWrites=true&w=majority";
// Create a new MongoClient
const client = new MongoClient(uri);
export default async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db("foodfornow").command({ ping: 1 });
    console.log("Connected successfully to server");
  } catch(error) {
    console.error(error)
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
