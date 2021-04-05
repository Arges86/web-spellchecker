const fs = require("fs");
const path = require("path");

module.exports = {
  "en-US": {
    affix: fs.readFileSync(path.resolve(__dirname, "./en_US.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./en_US.dic"))
  },
  "en-CA": {
    affix: fs.readFileSync(path.resolve(__dirname, "./en_CA.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./en_CA.dic"))
  },
  "en-GB": {
    affix: fs.readFileSync(path.resolve(__dirname, "./en_GB.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./en_GB.dic"))
  },
  es: {
    affix: fs.readFileSync(path.resolve(__dirname, "./es.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./es.dic"))
  },
  bg: {
    affix: fs.readFileSync(path.resolve(__dirname, "./bg.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./bg.dic"))
  },
  cs: {
    affix: fs.readFileSync(path.resolve(__dirname, "./cs.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./cs.dic"))
  },
  da: {
    affix: fs.readFileSync(path.resolve(__dirname, "./da.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./da.dic"))
  },
  de: {
    affix: fs.readFileSync(path.resolve(__dirname, "./de.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./de.dic"))
  },
  el: {
    affix: fs.readFileSync(path.resolve(__dirname, "./el.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./el.dic"))
  },
  fr: {
    affix: fs.readFileSync(path.resolve(__dirname, "./fr.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./fr.dic"))
  },
  it: {
    affix: fs.readFileSync(path.resolve(__dirname, "./it.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./it.dic"))
  },
  ru: {
    affix: fs.readFileSync(path.resolve(__dirname, "./ru.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./ru.dic"))
  }
};