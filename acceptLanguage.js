var parser = require('accept-language-parser');

var languages = parser.parse('en-US,en;q=0.9, da;q=0.8');

console.log(languages);
