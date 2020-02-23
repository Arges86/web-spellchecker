var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");

const filePath = path.join(__dirname, "../files/dict.txt");

/* GET search results. */
router.get("/", function(req, res) {

  fs.readFile(filePath, "utf8"  , function(err, data) {
    if (!err) {
      var output = data.split(/\r?\n/);
      res.send(JSON.stringify(output));
    } else {
      console.log(err);
      res.status(500).send(err);
    }
  });
});

module.exports = router;
