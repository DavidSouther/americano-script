function Comma(){}
Comma.regex = /,/;
Comma.prototype.toString = function() { return "COMMA()"; };
Comma.prototype.toCode = function(){ return ','; }

module.exports = Comma;
