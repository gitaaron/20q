var fs = require('fs');
var cheerio = require('cheerio');

var content = fs.readFileSync(__dirname+'/../fixtures/second_q.html').toString();

console.log(content);

var reg = new RegExp(/Q[0-9]+\.\s*(&nbsp;)?(.*)<br>/);

var question = reg.exec(content)[2];
console.log(question);
