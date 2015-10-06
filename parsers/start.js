var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync(__dirname+'/../fixtures/start.html').toString();

var $ = cheerio.load(content);

var anchors = $('a');
console.log(anchors.length);

anchors.each(function(index, anchor) {
    debugger;
    console.log('a : ' + $(anchor).text());
});
