function Identifier(match){
  this.ident = match;
}
Identifier.regex = /[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*/;
Identifier.prototype.toString = function(){
  return "IDENT(" + this.ident + ")"
};
Identifier.prototype.toCode = function(){
  return this.ident;
}

module.exports = Identifier;
