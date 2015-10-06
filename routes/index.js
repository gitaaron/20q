/**
 * Module dependencies
 */
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');
var setup = require('../scripts/setup');
var fs = require('fs');

var und = require('underscore');

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



function begin(callback) {
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
            callback(question);
        });
    });
}


function next(option, callback) {

    console.log($('a')[0].attribs.href)
    var answer = question.options[option];
    var response = '';

    request.get('http://y.20q.net'+answer.href)
        .on('data', function(data) {
            response+=data; 
        }).on('end', function() {
            if(response.indexOf('You were thinking')!==-1) {
                callback({success:true});
            } else if (response.indexOf('You won')!==-1) {
                callback({give_up:true});
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
                callback(question);
            }
        });
}

var next_template = fs.readFileSync(__dirname+'/../twilio_views/next.xml').toString();
next_template = und.template(next_template);


var begin_template = fs.readFileSync(__dirname+'/../twilio_views/begin.xml').toString();
begin_template = und.template(begin_template);

var success_template = fs.readFileSync(__dirname+'/../twilio_views/success.xml').toString();
success_template = und.template(success_template);

var giveup_template = fs.readFileSync(__dirname+'/../twilio_views/giveup.xml').toString();
giveup_template = und.template(giveup_template);

indexRouter.get('/app', function(req, res) {
    res.set('Content-Type', 'text/xml');
    if(req.query['Digits']) {
        if (typeof req.query['Digits'] == 'string') {
            var option = parseInt(req.query['Digits'])-1;
        } else {
            var option = parseInt(req.query['Digits'].pop())-1;
        }
        next(option, function(question) {
            res.end(next_template({question_message:question.message}));
        });
    } else {
        begin(function(question) {
            if(question.success) {

            } else if (question.give_up) {

            } else {
                res.end(begin_template({question_message:question.message}));
            }
        });
    }
});

exports.indexRouter = indexRouter;
