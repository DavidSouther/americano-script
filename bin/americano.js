var AmericanoScript = require('../lib/americano');
var fs = require('fs');

var file, name, enc = {encoding: 'utf-8'};

for (var i = 2 ; i < process.argv.length; i++) {
  file = process.argv[i];
  name = file.replace(/acs$/, 'js');
  fs.writeFileSync(name, AmericanoScript.compile(fs.readFileSync(file, enc)), enc);
}
