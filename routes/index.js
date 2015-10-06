/**
 * Module dependencies
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var setup = require('../scripts/setup');

/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
var indexRouter = express.Router();

/**
 * this accepts all request methods to the `/` path
 */
indexRouter.route('/')
  .all(function (req, res) {
    res.render('index', {
      title: '20q'
    });
  });

var question;
var $;

var reg = new RegExp(/Q[0-9]+\.\s*(&nbsp;)?(.*)<br>/);

indexRouter.get('/begin', function(req, res) {
    setup.makeRequest(function(start_url) {
        var response = '';
        request.post(start_url, { form: { sex: 77, age: 33, ccode: 16707, cctkr: "CA,LV,RU,AX", submit: "Play"}}).on('data', function(data) {
            response+=data.toString();
        }).on('end', function() {
            console.log(response);          
            $ = cheerio.load(response);
            var options = [];
            $('a').each(function(i, a) {
                options.push({
                    href:$(a).attr('href'),
                    text:$(a).text()
                });
            });
            question = { message: reg.exec(response)[2] + ' Press 1 for animal, 2 for vegetable, 3 for mineral, 4 for other or 5 for unknown', options: options};
            $('a').each(function(i, a) {
                console.log($(a).text());
            });
            res.end(JSON.stringify(question));
        });
    });

});

indexRouter.get('/next', function(req, res) {
    debugger;
    if(req.query.option) {
        var option = req.query.option;
    } else {
        var option = 0;
    }
    // @TODO insert next request here
    console.log($('a')[0].attribs.href)
    var answer = question.options[option];
    var response = '';

    request.get('http://y.20q.net'+answer.href)
        .on('data', function(data) {
            response+=data; 
        }).on('end', function() {
            if(response.indexOf('You were thinking')!==-1) {
                res.end(JSON.stringify({success:true}));
            } else if (response.indexOf('You won')!==-1) {
                res.end(JSON.stringify({give_up:true}));
            } else {
                $ = cheerio.load(response);
                console.log(response);
                var options = [];
                $('a').each(function(i, a) {
                    options.push({
                        href:$(a).attr('href'),
                        text:$(a).text()
                    });
                });

                question = { message: reg.exec(response)[2] + ' Press 1 for yes, 2 for no, 3 for unknown, 4 for irrelevant or 5 for sometimes', options: options};
                res.end(JSON.stringify(question));
            }
        });


});

exports.indexRouter = indexRouter;
