var fs = require('fs');
var AmericanoScript = require('./americano');

var loadFile = function loadFile(module, filename) {
    var source = fs.readFileSync(filename, 'utf-8');
    var compiled = AmericanoScript.compile(source);
    module._compile(compiled, filename);
};

if (require.extensions) {
    var exts = AmericanoScript.FILE_EXTENSIONS;
    for(var i = 0, q = exts.length; i < q ; i++){
        require.extensions[exts[i]] = loadFile;
    }
}
