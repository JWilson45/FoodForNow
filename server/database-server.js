const express = require('express');
const bodyParser = require('body-parser');

const db = require('./dataAccess/getRecipe');

const app = express();
const port = 3307;

app.use(bodyParser.json());
app.use(express.static('client/public'));

app.get('/', (req, res) => {
  res.send("What up. We in devolopment baby.")
})

app.get('/juan', (req, res) => {
  console.log('Juan Sent');
  res.sendFile('juan.jpg', {
    root: './client/public/images'
  })
})
app.get('/jake', (req, res) => {
  console.log('Jake Sent');
  res.sendFile('jake.jpg', {
    root: './client/public/images'
  })
})

app.route('/recipe').get(db.getRecipe)

app.listen(port, () => console.log(`Server listening on port ${port}`));
