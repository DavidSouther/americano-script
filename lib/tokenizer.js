var Lexer = require('./lexer');

function Tokenizer(){
  this.lexer = new Lexer();
  this.reset();
  this.rules();
}

Tokenizer.prototype = Object.create({
  tokenize: function(source){
    this.lexer.reset(source);
    this.reset();

    while(this.lexer.hasNext()){
      this.tokens.push(this.lexer.next());
    }

    return this.tokens;
  },

  reset: function(){
    this.tokens = [];
    this.line = 1;
    this.column = 0;
  },

  currentPosition: function(){
    return {
      line: this.line,
      column: this.column
    };
  },

  advance: function(skip){
    this.line += skip.lines;
    if(skip.lines === 0){
      this.column += skip.columns;
    } else {
      this.column = skip.columns;
    }
  },

  rules: function(){
    var INIT = this.lexer.state();
    // Tokenizer.Tokens.forEach(function(rule){
    for(var name in Tokenizer.Tokens){
      (function(rule){
        INIT(rule.regex)(function(match){
          var token = new rule(match);
          token.position = this.currentPosition();
          token.skip = token.skip || function(){
            return {lines: 0, columns: match.length};
          };
          this.advance(token.skip());
          return token;
        }.bind(this));
      }.bind(this)(Tokenizer.Tokens[name]));
    }
    // }, this);
  }
});

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
}

function SingleComment(match){
  this.comment = match.substring(2);
}
SingleComment.regex = /\/\/[^\n]+/;
SingleComment.prototype.toString = function(){
  return "COM(" + this.comment + ")"
};
SingleComment.prototype.toCode = function(){
  return "// " + this.comment;
};

function MultiComment(match){
  this.comment = match;
  var _t = this.comment.split('\n');
  var lines = _t.length;
  var columns = _t[lines-1].length;
  this._advance = {
    lines: lines,
    columns: columns
  };
}
MultiComment.regex = /\/\*[\s\S]*\*\//gm;
MultiComment.prototype.toString = function(){
  return "MCOM(" + this.comment + ")"
};
MultiComment.prototype.skip = function(){
  return this._advance;
};
MultiComment.prototype.toCode = function(){
  return this.coment;
}

function Identifier(match){
  this.ident = match;
}
Identifier.regex = /([$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)?/;
Identifier.prototype.toString = function(){
  return "IDENT(" + this.ident + ")"
};
Identifier.prototype.toCode = function(){
  return this.ident;
}

function Unknown(match){
  this.char = match;
}
Unknown.regex = /./;
Unknown.prototype.toString = function(){
  return "UKN(" + this.char + ")";
};
Unknown.prototype.toCode = function(){
  return this.char;
}

function Open(match){this.block = match;}
Open.regex = /[\(\{\[]/;
Open.prototype.toString = function(){ return "Open()"; };
Open.prototype.toCode = function(){ return this.block; }
function Close(match){this.block = match;}
Close.regex = /[\)\}\]]/;
Close.prototype.toString = function(){ return "Close()"; };
Close.prototype.toCode = function(){ return this.block; }

function NumberTok(match){ this.number = match; };
NumberTok.regex = /^0b[01]+|^0o[0-7]+|^0x[\da-f]+|^\d*\.?\d+(?:e[+-]?\d+)?/i;
NumberTok.prototype.toString = function() { return "NUM(" + this.number + ")"}
NumberTok.prototype.toCode = function(){ return this.number; }

function Operator(match){ this.operator = match; }
Operator.regex = /^(?:[-=]>|[-+*/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>*/%])\2=?|\?(\.|::)|\.{2,3})/;
Operator.prototype.toString = function() { return "OP(" + this.operator + ")";}
Operator.prototype.toCode = function(){ return this.operator; }

function StringTok(match){ this.string = match; }
StringTok.regex = /['"][^'"]+['"]/g;
StringTok.prototype.toString = function() { return "STRING(" + this.string + ")"; };
StringTok.prototype.toCode = function(){ return this.string; }

function Comma(){}
Comma.regex = /,/;
StringTok.prototype.toString = function() { return "COMMA()"; };
Comma.prototype.toCode = function(){ return ','; }

Tokenizer.Tokens = {
  NewLine: NewLine, Whitespace: Whitespace,
  MultiComment: MultiComment, SingleComment: SingleComment,
  Identifier: Identifier, NumberTok: NumberTok, StringTok: StringTok,

  Operator: Operator,
  Open: Open, Close: Close, Comma: Comma,

  Unknown: Unknown
};

module.exports = Tokenizer;
