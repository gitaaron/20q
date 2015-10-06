var request = require('request');
var cheerio = require('cheerio');


var str = '';

var options = {
    url:'http://y.20q.net/gsq-enCA',
    //url:'http://localhost:3133/gsq-enCA',
    headers: {
        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36",
        "Referer":"http://20q.net/play.html"
    }
};

exports.makeRequest = function(callback) {
    request.get(options)
        .on('data', function(data) {
            str += data;
        }).on('end', function() {
            var $ = cheerio.load(str);
            var start_url = 'http://y.20q.net' + $('form').attr('action');
            callback(start_url);
        });

};
