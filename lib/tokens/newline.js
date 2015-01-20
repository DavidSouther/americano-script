var Indent = require('./indent');
var Dedent = require('./dedent');

function NewLine(match, tokenizer){
  this.space = match.replace('\r', '').replace('\n', '');
  tokenizer.countPrespace(this.space);
  if(tokenizer.indenting){
    return new Indent(this.space, this.position);
  } else if (tokenizer.dedenting) {
    return new Dedent(this.space, this.position);
  } else {
    return this;
  }
}
// https://people.mozilla.org/~jorendorff/es6-draft.html#sec-line-terminators
NewLine.regex = /\r?\n\s*/;
NewLine.prototype.toString = function(){
  return "NL(" + this.depth + ")";
};
NewLine.prototype.skip = function(){
  return {lines: 1, columns: this.depth};
};
NewLine.prototype.toCode = function(){
  return '\n';
};

module.exports = NewLine;
