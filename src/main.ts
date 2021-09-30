import db from './models/database'
// import 'fs'
import http from 'http'
// import 'https'
import express from 'express'

// Load environment variables


// var privateKey  = fs.readFileSync('sslcert/server.key', 'utf8');
// var certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

// var credentials = {key: privateKey, cert: certificate};
const app = express();
const HTTP_PORT = process.env.HTTP_PORT || 8080

// your express configuration here
app.use(express.static('public'))


app.route('/users')
.get((req, res) =>
  {res.send('Users')
})

db()


const HTTP_SERVER = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);

HTTP_SERVER.listen(HTTP_PORT, () => {
  console.log(`HTTP Server listening on port ${HTTP_PORT}`);
});
// httpsServer.listen(3443);
