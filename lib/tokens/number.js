function NumberTok(match){ this.number = match; };
NumberTok.regex = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i;
NumberTok.prototype.toString = function() { return "NUM(" + this.number + ")"}
NumberTok.prototype.toCode = function(){ return this.number; }

module.exports = NumberTok;
