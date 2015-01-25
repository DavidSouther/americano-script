var Walker = require('./walker');

var Operator = require('../tokens/operator');
var Identifier = require('../tokens/identifier');

module.exports = new Walker({
  Expression: function(expression){
    var p = expression.nodes;
    for(var i = p.length - 1; i > 0; i--){
      if(p[i].token instanceof Operator && p[i].token.operator === '::'){
        var position = p[i].position;
        if(p[i + 1].token instanceof Identifier){
          p[i].token = new Operator('.prototype.');
        } else {
          p[i].token = new Operator('.prototype');
        }
        p[i].token.position = position;
      }
    }
  }
});
