function NewLine(){}
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-line-terminators
NewLine.regex = /\r?\n/;
NewLine.prototype.toString = function(){
  return "NL()";
};
NewLine.prototype.skip = function(){
  return {lines: 1, columns: 0};
};
NewLine.prototype.toCode = function(){
  return '\n';
};

module.exports = NewLine;
