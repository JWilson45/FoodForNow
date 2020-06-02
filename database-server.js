const express = require('express');

const app = express();
const port = 3307;

app.get('/', (req, res) => {
  res.send("What up. We in devolopment baby.")
})

app.get('/juan', (req, res) => {
  res.sendFile('./images/juan.jpg')
})

app.listen(port, () => console.log(`Server listening on port ${port}`));
