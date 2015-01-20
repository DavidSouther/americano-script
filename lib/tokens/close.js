function Close(match){this.block = match;}
Close.regex = /[\)\}\]]/;
Close.prototype.toString = function(){ return "CLOSE()"; };
Close.prototype.toCode = function(){ return this.block; }

module.exports = Close;
