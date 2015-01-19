var Walker = require('./walker');

var Operator = require('../tokens/operator');
var Identifier = require('../tokens/identifier');

module.exports = new Walker({
  walkLine: function(line){
    var p = line.tokens;
    for(var i = p.length - 1; i > 0; i--){
      if(p[i] instanceof Operator && p[i].operator === '::'){
        var position = p[i].position;
        if(p[i + 1] instanceof Identifier){
          p[i] = new Operator('.prototype.');
        } else {
          p[i] = new Operator('.prototype');
        }
        p[i].position = position;
      }
    }
  }
});
