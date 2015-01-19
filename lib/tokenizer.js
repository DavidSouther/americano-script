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

var NewLine = require('./tokens/newline');
var Whitespace = require('./tokens/whitespace');
var SingleComment = require('./tokens/singlecomment');
var MultiComment = require('./tokens/multicomment');
var Identifier = require('./tokens/identifier');
var Open = require('./tokens/open');
var Close = require('./tokens/close');
var Operator = require('./tokens/operator');
var Regex = require('./tokens/Regex');
var NumberTok = require('./tokens/number');
var StringTok = require('./tokens/string');
var Comma = require('./tokens/comma');
var Unknown = require('./tokens/unknown');

Tokenizer.Tokens = {
  NewLine: NewLine, Whitespace: Whitespace,
  MultiComment: MultiComment, SingleComment: SingleComment,
  Identifier: Identifier, NumberTok: NumberTok, StringTok: StringTok,

  Operator: Operator, Regex: Regex,
  Open: Open, Close: Close, Comma: Comma,

  Unknown: Unknown
};

module.exports = Tokenizer;
