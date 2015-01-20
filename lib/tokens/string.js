function StringTok(match){ this.string = match; }
StringTok.regex = /(['"]).*\2/g;
StringTok.prototype.toString = function() { return "STRING(" + this.string + ")"; };
StringTok.prototype.toCode = function(){ return this.string; }

module.exports = StringTok;
