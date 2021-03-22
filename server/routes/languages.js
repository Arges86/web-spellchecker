var express = require("express");
var router = express.Router();

/* GET search results. */
router.get("/", function (req, res) {

  // const list = ["en-US", "en-CA"];
  const list = [{
    name: "English (US)",
    value: "en-US"
  },
  {
    name: "English (CA)",
    value: "en-CA"
  },
  {
    name: "English (United Kingdom)",
    value: "en-GB"
  },
  {
    name: "Spanish (or Castilian)",
    value: "es"
  }];
  res.json(list);

});

module.exports = router;