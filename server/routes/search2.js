var express = require("express");
var router = express.Router();

const site = require("../commons/webpage");
const Dictionary = require("../commons/dictionary");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/* GET search results. */
router.get("/", async function(req, res) {
  console.log(req.query.site);

  // gets all the dictionary values
  const dictionary = new Dictionary();
  const words = new Set(dictionary.getDictionary());

  try {
    const output = await site.getSite(req.query.site, words);
    res.send(output);
  } catch (error) {
    res.status(500).send({Error: "Error rendering page"});
  }
 
});

module.exports = router;