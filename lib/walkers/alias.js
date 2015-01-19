var Walker = require('./walker');
var Identifier = require('../tokens/identifier');
var Whitespace = require('../tokens/whitespace');
var Operator = require('../tokens/operator');

var ALIASES = {
  'and': '&&',
  'or': '||',
  'is': '===',
  'fn': 'function',
  'yes': 'true',
  'no': 'false'
}

var Aliases = Object.keys(ALIASES);

module.exports = new Walker({
  walkLine: function(line){
    var p = line.tokens;
    for(var i = p.length - 1; i >= 0; i--){
      // Special case for fn*
      if(p[i] instanceof Identifier){
        var pws = i == 0 || p[i-1] instanceof Whitespace;
        var nws = i == p.length - 1 || p[i+1] instanceof Whitespace;
        if(p[i].ident === 'fn' && p[i+1].operator === '*'){
          nws = true;
        }
        if(pws && nws){
          if(Aliases.indexOf(p[i].ident) > -1) {
            var position = p[i].position;
            p[i] = new Operator(ALIASES[p[i].ident]);
            p[i].position = position;
          }
        }
      }
    }
  }
});
