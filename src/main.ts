// import 'fs'
import http from 'http'
// import 'https'
import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

/*-------------------------------------
 *
 *            Import Routes
 *
 *------------------------------------*/
import User_Routes from "./routes/user_router";
import Ingredient_Routes from "./routes/ingredient_router";
import Meal_Routes from "./routes/meal_routes";
import Recipe_Routes from "./routes/recipe_routes";


// Place routes into an iterable
const Routes = [
  Ingredient_Routes,
  User_Routes,
  Meal_Routes,
  Recipe_Routes,
]


/*-------------------------------------
 *
 *          End Import Routes
 *
 *------------------------------------*/


const HTTP_PORT = process.env.HTTP_PORT || 8080

// HTTPS Stuff
// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};



const app = express();

// your express configuration here
app.use(express.static('public'))
app.use(express.json());

// for each route in the iterable, pass the express app to enable the routes
Routes.forEach(route => {
  route(app)
});


const HTTP_SERVER = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

HTTP_SERVER.listen(HTTP_PORT, () => {
  console.log(`HTTP Server listening on port ${HTTP_PORT}`);
});
// httpsServer.listen(3443);
