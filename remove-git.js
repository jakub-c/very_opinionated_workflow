var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
var del = require('del');

console.log('Do you want to remove .git [y/n]?');
rl.prompt();
rl.on('line', (line) => {
  if (line === 'y' || line === 'Y') {
    del.sync('.git');
    console.log('Git files removed from the folder.');  
    rl.close();
  }
  if (line === 'n' || line === 'N') {
    process.exit(0);
  }
  console.log('Do you want to remove .git [y/n]?');
  rl.prompt();
}).on('close', () => {
  process.exit(0);
});
