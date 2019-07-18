var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')

filePath = path.join(__dirname, '../files/dict.txt')

/* GET search results. */
router.get('/', function(req, res, next) {

    fs.readFile(filePath, 'utf8'  , function(err, data) {
        if (!err) {
            var output = data.split('\n');
            res.send(JSON.stringify(output));
        } else {
            console.log(err);
            res.status(500).send(err);
        }
    })
});

module.exports = router;
