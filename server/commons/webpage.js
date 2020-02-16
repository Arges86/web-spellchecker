const rp = require("request-promise");
const cheerio = require("cheerio");

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function getSite(data) {
    domain = breakDownURL(data);

    const options = {
        uri: data,
        transform: function (body) {
            return cheerio.load(body);
        }
    }

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
                    if (uri.includes(domain)) {
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
        })
}

async function getUrl(data, ws) {
    data.forEach(element => {
        // ws.send(JSON.stringify(element));
        getSite(element)
            .then(results => {
                results.url = element;
                ws.send(JSON.stringify(results));
            })
            .catch(error => {
                console.log('Error: ', element, error);
            })
    });
}

function uniq(a) {
    return Array.from(new Set(a));
}

// removes protocal and 'www' from URL
function breakDownURL(url) {
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