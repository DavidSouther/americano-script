function Close(match){this.block = match;}
Close.regex = /[\)\}\]]/;
Close.prototype.toString = function(){ return "Close()"; };
Close.prototype.toCode = function(){ return this.block; }

module.exports = Close;
