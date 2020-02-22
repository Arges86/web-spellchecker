const rp = require("request-promise");
const cheerio = require("cheerio");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function getSite(data) {

  if (data.charAt(0) === "\"") {
    data = data.replace(/['"]+/g, "");
  }

  const domain = breakDownURL(data);

  const options = {
    uri: data,
    transform: function (body) {
      return cheerio.load(body);
    }
  };

  return rp(options)
    .then($ => {
      console.log($("title").text());

      let textArray = ($("body").text()).replace(/\W/g, " "); // removes all non 'word characters'
      textArray = textArray.split(" "); // splits text into array at space
      textArray = textArray.filter(function (e) { return e; });
      textArray = uniq(textArray); // removes any duplicate words
      textArray = textArray.filter(x => isNaN(x)); // removes any numbers

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
            urlArray.push(uri);
          }
        }
      });

      const output = {
        text: textArray,
        links: urlArray,
      };
      return output;
    });
}

async function getUrl(first, data, ws) {
  // const URLs =  new Set(data);
  let URLs = new Array;
  URLs = data;

  if (first.charAt(0) === "\"") {
    first = first.replace(/['"]+/g, "");
  }

  // gets domain of first URL
  const domain = breakDownURL(first);
  console.log(`Domain: ${domain}`);

  for (let i = 0; i < URLs.length; i++) {

    try {
      const results = await getSite(URLs[i]);

      // adds URL to outbound results object
      results.url = URLs[i];

      // loops through all returned urls
      (results.links).forEach(element => {

        // if URL is part of the domain
        if (breakDownURL(element) === domain) {
        // if URL is not already on list
          if (!URLs.includes(element)) {
            URLs.push(element);
            console.log(`Adding new element: ${element}`);
          }
        }
      });

      ws.send(JSON.stringify(results));

    } catch (error) {
      console.log(error);
    }


    // if loop is done, close connection
    console.log(URLs.length, (i + 1));
    if ((i + 1) === URLs.length) {
      console.log("All Done!");
      ws.close();
    }
  }
}

function uniq(a) {
  return Array.from(new Set(a));
}

// removes protocal and 'www' from URL
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



module.exports.getSite = getSite;
module.exports.getUrl = getUrl;