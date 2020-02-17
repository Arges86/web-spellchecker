var express = require("express");
var router = express.Router();
const rp = require("request-promise");
const cheerio = require("cheerio");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/* GET search results. */
router.get("/", function(req, res) {
  console.log(req.query.site);

  const options = {
    uri: req.query.site,
    transform: function (body) {
      return cheerio.load(body);
    }
  };
  rp(options)
    .then(function ($) {
      console.log( $("title").text());

      // removed 
      let textArray = ($("body").text()).replace(/\W/g, " "); // removes all non 'word characters'
      textArray = textArray.split(" "); // splits text into array at space
      textArray = textArray.filter(function(e){return e;}); 
      textArray = uniq(textArray); // removes any duplicate words
      textArray = textArray.filter(x => isNaN(x)); // removes any numbers

      var urlArray = [];
      $("a").each(function() {
        let uri =  $(this).attr("href");

        // if URI ends with with a backslash, remove it
        if (uri.endsWith("/")) {
          uri = uri.substring(0, uri.length - 1);
        }
        urlArray.push( uri );
      });

      const output = {
        text: textArray,
        links: urlArray,
      };
      res.send(output);
    })
    .catch(function (err) {
      res.status(err.statusCode || 500).send(err.message);
    });

});

function uniq(a) {
  return Array.from(new Set(a));
}

module.exports = router;