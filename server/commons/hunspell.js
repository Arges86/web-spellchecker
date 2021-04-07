const cheerio = require("cheerio");
const axios = require("axios");
const Nodehun = require("nodehun");
const dictionaries = require("../files/dictionaries");
require("chromedriver");
const {Builder, By} = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const driver = new Builder()
  .forBrowser("chrome")
  .setChromeOptions(new chrome.Options().addArguments("--headless"))
  .build();

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const languages = Object.keys(dictionaries);
console.log(languages);

/**
 * Get site information and return object
 * @param {string} site URL of webpage to search 
 * @param {string} dictionary Which dictionary to use
 * @param {boolean} fast Choose to search with cheerio or webdriver. Defaults to false
 */
async function getSite(site, dictionary, fast = false) {

  // if language isn't in list, throw error
  if (!languages.includes(dictionary)) {
    throw new Error("Unsupported dictionary format");
  }
  const nodehun = new Nodehun(dictionaries[dictionary].affix, dictionaries[dictionary].dictionary);

  if (site.charAt(0) === "\"") {
    site = site.replace(/['"]+/g, "");
  }

  const start = process.hrtime.bigint();
    
  const html = fast ? await getHtml(site) : await getHtmlWebDriver(site);

  let htmlData = html.replace(/>/g, "> "); 
  const $ = cheerio.load(htmlData);

  const pageText = getPageText($);
  const end = process.hrtime.bigint();

  const correct = [], incorrect = [];
  pageText.forEach(element => {
    if (nodehun.spellSync(element)) {
      correct.push(element);
    } else {
      incorrect.push(element);
    }
  });

  // gets the number of seconds of elapsed time
  const seconds = ((Number(end - start)) / 1000000000).toFixed(3);
  const links = getUrls(site, $);
  const images = getImages(site, $);

  return {
    text: pageText,
    incorrect: incorrect,
    correct: correct,
    links: links,
    images: images,
    time: `${seconds} seconds`,
  };

}

/**
 * removes duplicate values from array
 * @param {string[]} a List of words to filter
 * @returns {string[]}
 */
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
    domain = url.split(/[/?#]/)[0].split(".")[0];

    return domain;
  }
}

/**
 * Takes the initial URL for the page, and the relative url fragment and makes a full resource
 * @param {string} base the initial URL for this page's web scraping
 * @param {string} relative the (maybe) relative url 
 */
function relativeToAbsolute(base, relative) {
  base = new URL(base).origin;

  return new URL(relative, base).href;
}

/**
 * Returns all of the words on the wepage
 * @param {string} $ cheerio page object
 * @returns {string[]} Array of text
 */
function getPageText($) {
    
  // cleans up the array of text
  let textArray = [];
  textArray = ($("body").text()).replace(/\W/g, " "); // removes all non 'word characters'
  textArray = textArray.split(" "); // splits text into array at space
  textArray = textArray.filter(function (e) { return e; });
  textArray = uniq(textArray);
  textArray = textArray.filter(x => isNaN(x)); // removes any numbers
  return textArray;
}

/**
 * Gets axios object
 * @param {string} site URL of webpage 
 * @returns {Promise<object>} raw HTML data from site
 */
async function getHtml(site) {
  let html;
  try {
    html = await axios.get(site);

  } catch (error) {
    throw new Error("Failed to resolve page");
  }
      
  if (html.headers["content-type"]) {
    if (!(html.headers["content-type"]).includes("text/html")) {
      throw new Error("Its not a website!!");
    }
  }
      
  // if the page was re-directed, set that new url as the current
  if (html.request.res.responseUrl) {
    site = html.request.res.responseUrl;
  }
  return html.data;
}

async function getHtmlWebDriver(site) {
  await driver.get(site);
  const webElement = await driver.findElement(By.tagName("body"));
  return await webElement.getText();
}

/**
 * returns list of all URLs on webpage
 * @param {string} site URL of webpage
 * @param {object} $ cheerio page object
 * @returns {Array<string>}
 */
function getUrls(site, $) {

  const domain = breakDownURL(site);
  const urlArray = [];

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

        uri = uri.toLowerCase().trim();

        urlArray.push(relativeToAbsolute(site, uri));
      }
    }
  });
  return urlArray;
}

/**
 * returns list of all images on webpage
 * @param {string} site URL of webpage 
 * @param {object} $ cheerio page object
 * @returns {Array<string>}
 */
function getImages(site, $) {
  const imgArray = [];
  $("img").each(function () {
    let image = $(this).attr("src"); // <= normal image links
    let dataImage = $(this).attr("data-src"); // <= lazy loaded images from frameworks

    if (image) {
      image = relativeToAbsolute(site, image);
      imgArray.push(image);
    }

    if (dataImage) {
      dataImage = relativeToAbsolute(site, dataImage);
      imgArray.push(dataImage);
    }

  });
  return imgArray;
}

/**
 * Loops through list and send websocket response for each instance
 * @param {string} first List of the first domain
 * @param {Array<string>} data List of all domains
 * @param {WebSocket} ws Websocket instance 
 * @param {string} dictionary Which dictionary to use
 * @param {boolean} fast Choose to search with cheerio or webdriver
 * @returns 
 */
async function getUrl(first, data, ws, dictionary, fast) {
  const URLs = new Set(data);
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
  // console.log(`Domain: ${domain}`);

  let i = 0;
  let loop = false;
  for (let url of URLs) {

    i++;
    try {

      const results = await getSite(url, dictionary, fast);

      // adds URL to outbound results object
      results.url = url;

      // loops through all returned urls
      (results.links).forEach(element => {

        // if URL is part of the domain
        if (breakDownURL(element) === domain) {
          // if URL is not already on list
          if (!URLs.has(element)) {
            URLs.add(element);
            // console.log(`Adding new element: ${element}`);
          }
        }
      });

      ws.send(JSON.stringify(results));

    } catch (error) {
      console.log(error);
    }


    // if loop is done, close connection
    if (i === URLs.size) {
      console.log("All Done!");
      // console.timeEnd("loop");
      ws.close();
    }

    if (loop) {
      break;
    }

    ws.on("close", () => {
      loop = true;
      ws.close();
    });
  }
}

module.exports.getSite = getSite;
module.exports.getUrl = getUrl;