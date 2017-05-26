var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function (req, res) {

    var cheerio = require('cheerio'),
    url2 = 'http://www.morningstar.in/mutualfunds/f0gbr06rbo/sundaram-select-mid-cap-growth/detailed-portfolio.aspx';
    url3 = "http://www.morningstar.in/mutualfunds/f00000pd2b/mirae-asset-emerging-bluechip-fund---direct-plan---growth/detailed-portfolio.aspx";
    url4 = "http://www.morningstar.in/mutualfunds/f00000pduw/dsp-blackrock-natural-resources-and-new-energy-fund-direct-plan-growth/detailed-portfolio.aspx";

    request(url2, function (error, response, html) {
        if (!error) {
            var $ = cheerio.load(html);

            var tdelements= [];
            var jsonObject = [];
            // Iterate over TR elements
            $("table.pf_detailed tr").each(function (tr_index, tr) {
                tdelements = [];
                $(this).find("td").each(function (tr_index, td) {
                    // console.log($(this).html());
                    tdelements.push($(this).html());
                });
                if (tdelements.length > 10 && tdelements[1]) {
                    if (tdelements[1].indexOf('>Stock<') < 0) {
                        var obj = {};
                        var str = tdelements[1].trim().toLowerCase();
                        var mm = str.substring(str.lastIndexOf("title") + 7);
                        obj['stock'] = mm.substring(0, mm.indexOf(">") - 1);
                        obj['percentage'] = tdelements[5];
                        if (obj['stock'].indexOf('id=') < 0) {
                            jsonObject.push(obj);
                        }
                    }
                    // exit tr loop if total stock reached !!
                    if (tdelements[1].indexOf('Total Stock') > 0) {
                        return false;
                    }
                }

            });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(jsonObject));
            res.end();
        }
    });

})


app.listen('8081')
console.log('Magic happens on port 8081,try http://localhost:8081/scrape');
exports = module.exports = app;