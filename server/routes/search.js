var express = require('express');
var router = express.Router();
var BodyExtractor = require('extract-main-text');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/* GET search results. */
router.get('/', function(req, res, next) {
  console.log(req.query.site);
  
  var extractor = new BodyExtractor({
    url: req.query.site
  }); 
  extractor.analyze()
  .then(function(text) {
    console.log(extractor.title);
    let html = extractor.html
    const urls = html.match((/\bhttps?:\/\/\S+/gi));

    let textArray = (extractor.mainText).replace(/\W/g, ' ');
    textArray = textArray.split(' ');
    textArray = textArray.filter(function(e){return e});

    const output = {
      text: textArray,
      links: urls
    }
    res.send(output);
  })
  .catch( error => {
    console.log(error);
    res.status(500).send(error.message);
  });
});

module.exports = router;
