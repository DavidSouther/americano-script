var Walker = require('./walker');

var Identifier = require('../tokens/identifier');
var Whitespace = require('../tokens/whitespace');
var Operator = require('../tokens/operator');
var Open = require('../tokens/open');
var Token = require('../ast/token');

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
  Expression: function(expression){
    var p = expression.nodes;
    for(var i = p.length - 1; i >= 0; i--){
      // Special case for fn*
      if(p[i].token instanceof Identifier){
        var pws = i == 0 || p[i-1].token instanceof Whitespace;
        var nws = i == p.length - 1 || p[i+1].token instanceof Whitespace;
        if(p[i].token.ident === 'fn'){
          nws = p[i+1].token.operator === '*' || p[i+1].token instanceof Open;
        }
        if(pws && nws){
          if(Aliases.indexOf(p[i].token.ident) > -1) {
            var position = p[i].token.position;
            p[i] = new Token(new Operator(ALIASES[p[i].token.ident]));
            p[i].token.position = position;
          }
        }
      }
    }
  }
});
