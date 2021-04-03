var express = require("express");
var router = express.Router();

/* GET search results. */
router.get("/", function (req, res) {

  // const list = ["en-US", "en-CA"];
  const list = [{
    name: "English (US)",
    value: "en_US"
  },
  {
    name: "English (CA)",
    value: "en_CA"
  },
  {
    name: "English (United Kingdom)",
    value: "en_GB"
  },
  {
    name: "Spanish (or Castilian)",
    value: "es"
  },
  {
    name: "Bulgarian",
    value: "bg"
  },
  {
    name: "Czech",
    value: "cs"
  },
  {
    name: "Danish",
    value: "da"
  },
  {
    name: "German",
    value: "de"
  },
  {
    name: "Modern Greek",
    value: "el"
  },
  {
    name: "French",
    value: "fr"
  },
  {
    name: "Italian",
    value: "it"
  },
  {
    name: "Russian",
    value: "ru"
  }];

  list.sort((a, b) => {
    let fa = a.name.toLowerCase();
    let fb = b.name.toLowerCase();

    if (fa < fb) {
      return -1;
    }
    if (fa > fb) {
      return 1;
    }
    return 0;
  });
  res.json(list);

});

module.exports = router;