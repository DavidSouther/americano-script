function Open(match){this.block = match;}
Open.regex = /[\(\{\[]/;
Open.prototype.toString = function(){ return "OPEN()"; };
Open.prototype.toCode = function(){ return this.block; }

module.exports = Open;
