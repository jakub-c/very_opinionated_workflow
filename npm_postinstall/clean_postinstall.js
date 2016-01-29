var fs = require('fs');
var file = require('./../package.json');

file.scripts.postinstall = '';
fs.writeFileSync('package.json', JSON.stringify(file, null, 2));
console.log('');
console.log('Cleaning postinstall package.json field');
