const mysql = require('mysql');


exports.getRecipe = function(req, res) {
  var id = req.body.id;

var con = mysql.createConnection({
  host: "192.168.1.140",
  user: "phil",
  password: "phil1"
});

con.connect(function(err) {
  if (err) throw err;
  con.query("use recipeDB;", function(err, result) {
    if (err) throw err;
  });
  con.query("SELECT ind.name, cf.quantity FROM Recipes r LEFT JOIN CallsFor cf " +
  "ON r.recipeID = cf.recipeID LEFT JOIN Ingredients ind ON ind.IngredientsID = " +
  "cf.IngredientsID WHERE cf.recipeID = "+ id +";",
    function(err, result) {
      if (err) throw err;
      console.log(result);
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(id.toString());
    })
  con.end();
});

}
