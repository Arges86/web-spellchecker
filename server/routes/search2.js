var express = require('express');
var router = express.Router();
const rp = require('request-promise');
const cheerio = require('cheerio');

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

/* GET search results. */
router.get('/', function(req, res, next) {
    console.log(req.query.site);

    const options = {
        uri: req.query.site,
        transform: function (body) {
            return cheerio.load(body);
        }
    };
    rp(options)
    .then(function ($) {
        console.log( $('title').text());
        let textArray = ($('body').text()).replace(/\W/g, ' ');
        textArray = textArray.split(' ');
        textArray = textArray.filter(function(e){return e})

        var urlArray = [];
        $('a').each(function() {
            urlArray.push( $(this).attr('href') );
        });

        const output = {
            text: textArray,
            links: urlArray,
        }
        res.send(output);
    })
    .catch(function (err) {
        res.status(500).send(err);
    })

});

module.exports = router;