var fs = require("fs");
var path = require("path");

module.exports = class Dictionary {

  constructor() {
    const filePath = path.join(__dirname, "../files/dict.txt");
    const stream = fs.readFileSync(filePath, "utf-8");
    this._dictionary = stream.split(/\r?\n/);
  }

  getDictionary() {
    return this._dictionary;
  }
};
