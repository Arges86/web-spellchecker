// const rp = require("request-promise");
const cheerio = require("cheerio");
const axios = require("axios");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function getSite(data, dictionary) {

  if (data.charAt(0) === "\"") {
    data = data.replace(/['"]+/g, "");
  }

  const domain = breakDownURL(data);

  const start = process.hrtime.bigint();
  
  let html;
  try {
    html = await axios.get(data);
  } catch (error) {
    throw new Error("Failed to resolve page");
  }
  
  const $ = await cheerio.load(html.data);

  console.log($("title").text());
  const end = process.hrtime.bigint();

  let textArray = ($("body").text()).replace(/\W/g, " "); // removes all non 'word characters'
  textArray = textArray.split(" "); // splits text into array at space
  textArray = textArray.filter(function (e) { return e; });
  textArray = uniq(textArray); // removes any duplicate words
  textArray = textArray.filter(x => isNaN(x)); // removes any numbers

  //loops through text and spell checks
  const correct = [], incorrect=[];
  textArray.forEach(element => {
    if (inDictionary(dictionary, element)) {
      correct.push(element);
    } else {
      incorrect.push(element);
    }
  });

  // creates url
  var urlArray = [];
  $("a").each(function () {
    let uri = $(this).attr("href");

    if (uri === undefined || uri === null) {
      // do nothing
    } else {

      // if url is part of the domain
      if (breakDownURL(uri) === domain) {
        // if URI ends with with a backslash, remove it
        if (uri.endsWith("/")) {
          uri = uri.substring(0, uri.length - 1);
        }
        urlArray.push(uri.toLowerCase().trim());
      }
    }
  });

  // gets the number of seconds of elapsed time
  const seconds = ((Number(end - start)) / 1000000000).toFixed(3);

  const output = {
    text: textArray,
    incorrect: incorrect,
    correct: correct,
    links: urlArray,
    time: `${seconds} seconds`,
  };
  return output;
}

async function getUrl(first, data, ws, dictionary) {
  const URLs =  new Set(data);
  // let URLs = new Array;
  // URLs = data;
  URLs.delete(first);

  // console.time("loop");

  if (data.length === 0) {
    ws.close();
    return;
  }

  if (first.charAt(0) === "\"") {
    first = first.replace(/['"]+/g, "");
  }

  // gets domain of first URL
  const domain = breakDownURL(first);
  console.log(`Domain: ${domain}`);

  // for (let i = 0; i < URLs.length; i++) {
  let i = 0;
  for (let url of URLs) {

    i++;
    try {

      // const start = process.hrtime.bigint();
      const results = await getSite(url, dictionary);
      // var end = process.hrtime.bigint();

      // adds URL to outbound results object
      results.url = url;

      // const seconds = ((Number(end - start)) / 1000000000).toFixed(3);
      // results.time = `${seconds} seconds`;

      // loops through all returned urls
      (results.links).forEach(element => {

        // if URL is part of the domain
        if (breakDownURL(element) === domain) {
        // if URL is not already on list
          if (!URLs.has(element)) {
            URLs.add(element);
            console.log(`Adding new element: ${element}`);
          }
        }
      });

      ws.send(JSON.stringify(results));

    } catch (error) {
      console.log(error);
    }


    // if loop is done, close connection
    console.log(URLs.size, i );
    if (i === URLs.size) {
      console.log("All Done!");
      // console.timeEnd("loop");
      ws.close();
    }
  }
}

function uniq(a) {
  return Array.from(new Set(a));
}

/**
 * Strips a URL for just the domain
 * @param {string} url The web address
 * @return {string} The domain portion of the url
 */
function breakDownURL(url) {
  // eslint-disable-next-line no-useless-escape
  const http = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;
  if (http.test(url)) {
    let domain = "";
    // remove 'http://'
    if (url.indexOf("http://") === 0) {
      url = url.substr(7);
    }
    // remove 'https://'
    if (url.indexOf("https://") === 0) {
      url = url.substr(8);
    }
    // remove 'www.'
    if (url.indexOf("www.") === 0) {
      url = url.substr(4);
    }
    domain = url.split("/")[0].split(".")[0];

    return domain;
  }
}

function inDictionary(set, val) {
  return set.has(val.toLowerCase());
}

module.exports.getSite = getSite;
module.exports.getUrl = getUrl;