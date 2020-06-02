const mysql = require('mysql');

// Connection constraints for connection to recipeDB
const con = mysql.createConnection({
  host: "73.89.101.43",
  user: "phil",
  password: "phil1",
  database: "recipeDB"
});

exports.getRecipe = function(req, res) {
  var id = req.body.id;

  con.connect(function(err) {
    if (err) throw err;

    // Query for selecting recipe based on its ID
    con.query("SELECT ind.name, cf.quantity FROM Recipes r LEFT JOIN CallsFor cf " +
    "ON r.recipeID = cf.recipeID LEFT JOIN Ingredients ind ON ind.IngredientsID = " +
    "cf.IngredientsID WHERE cf.recipeID = "+ id +";",
    function(err, result) {
      if (err) throw err;
      // console.log(result);
      //
      // for (var i = 0; i < result.length; i++) {
      //   console.log(result[i].name);
      // }

      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(result);
    })
  con.end();
});
}

exports.inputRecipe = function (req, res) {
  console.log('recieved');
  console.log(req.body);

  // con.connect(function(err) {
  //   if (err) throw err;
  //
  //   con.query("INSERT INTO Ingredients (Name,Color,Catergory) VAULES " +
  //   "('" + ingName + "', '" + color + "', '" + catergory + "');")
  //
  //   con.query("INSERT INTO Recipe (Name,Cooktime,Prep Time, Total Time, Servings, Directions) VAULES " +
  //   "('" + recipeName + "', '" + cookTime + "', '" + catergory + "');")
  // })



}
