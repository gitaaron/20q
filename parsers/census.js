var fs = require('fs');
var cheerio = require('cheerio');


var content = fs.readFileSync(__dirname+'/../fixtures/census.html').toString();

var $ = cheerio.load(content);

console.log($('form').attr('action'));
