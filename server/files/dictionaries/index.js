const fs = require("fs");
const path = require("path");

module.exports = {
  en_US: {
    affix: fs.readFileSync(path.resolve(__dirname, "./en_US.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./en_US.dic"))
  },
  en_CA: {
    affix: fs.readFileSync(path.resolve(__dirname, "./en_CA.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./en_CA.dic"))
  },
  en_GB: {
    affix: fs.readFileSync(path.resolve(__dirname, "./en_GB.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./en_GB.dic"))
  },
  es: {
    affix: fs.readFileSync(path.resolve(__dirname, "./es.aff")),
    dictionary: fs.readFileSync(path.resolve(__dirname, "./es.dic"))
  }
};