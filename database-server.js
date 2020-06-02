const express = require('express');

const app = express();
const port = 1770;

app.get('/', (req, res) => {
  res.send("What up. We in devolopment baby.")
})

app.listen(port, () => console.log(`Server listening on port ${port}`));
