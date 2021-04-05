var express = require("express");
var router = express.Router();

const site = require("../commons/hunspell");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/* GET search results. */
router.get("/", async function(req, res) {

  try {
    const output = await site.getSite(req.query.site, req.query.dictionary);
    res.send(output);
  } catch (error) {
    console.log(error);
    res.status(500).send({"Error": error.message});
  }
 
});

module.exports = router;