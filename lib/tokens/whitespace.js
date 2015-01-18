function Whitespace(match){
  this.space = match;
  this.length = match.length;
  this.mixed = (match.indexOf('\s') > -1) && (match.indexOf('\t') > -1);
};
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-white-space
Whitespace.regex = /[\x09\x0B\x0C\x20\xA0\uFEFE]+/
Whitespace.prototype.toString = function(){
  var state = this.mixed ? 'MIXED' : 'CLEAN';
  return "SPACE(" + this.length + ", " + state + ")";
};
Whitespace.prototype.toCode = function(){
  return this.space;
};

module.exports = Whitespace;
