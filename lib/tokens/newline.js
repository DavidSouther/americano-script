var Indent = require('./indent');
var Dedent = require('./dedent');

function NewLine(match, tokenizer){
  this.space = match.replace('\r', '').replace('\n', '');
  this.depth = 0;
  if(tokenizer){
    var depth = tokenizer.prespace(this.space);
    if(tokenizer.indenting){
      return new Indent(tokenizer.indentStyle, depth);
    } else if (tokenizer.dedenting) {
      // Need to create several dedent tokens...
      return new Dedent(tokenizer.indentStyle, depth);
    }
  }
  return this;
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
