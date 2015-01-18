function Operator(match){ this.operator = match; }
Operator.regex = /^(?:[-=]>|[-+*/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*/%])\2=?|\?(\.|::)|\.{2,3})/;
Operator.prototype.toString = function() { return "OP(" + this.operator + ")";}
Operator.prototype.toCode = function(){ return this.operator; }

module.exports = Operator;
