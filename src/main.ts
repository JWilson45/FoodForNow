// import 'fs'
import http from 'http'
// import 'https'
import express from 'express'

/*-------------------------------------
 *
 *            Import Routes
 *
 *------------------------------------*/
import User_Routes from "./routes/user_router";
import Ingredient_Routes from "./routes/ingredient_router";


// Place routes into an iterable
const Routes = [
  User_Routes,
  Ingredient_Routes,
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

// for each route in the iterable, pass the express app to enable the routes
Routes.forEach(route => {
  route(app)
});

// your express configuration here
app.use(express.static('public'))


const HTTP_SERVER = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

HTTP_SERVER.listen(HTTP_PORT, () => {
  console.log(`HTTP Server listening on port ${HTTP_PORT}`);
});
// httpsServer.listen(3443);
