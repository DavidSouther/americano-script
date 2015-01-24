var Lexer = require('./lexer');

function Tokenizer(){
  this.lexer = new Lexer();
  this.reset();
  this.rules();
}

Tokenizer.prototype = Object.create({
  tokenize: function(source){
    this.reset(source);

    while(this.lexer.hasNext()){
      this.tokens.push(this.lexer.next());
    }

    return this.tokens;
  },

  reset: function(source){
    this.lexer.reset(source);

    this.tokens = [];
    this.line = 1;
    this.column = 0;

    this.indentStyle = '';
    this.indent = 0;
  },

  next: function(){
    return this.lexer.next();
  },

  hasNext: function(){
    return this.lexer.hasNext();
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

  /**
   * Figure out how deep in the block scope we are based on indent level, and
   * if we just went deeper mark as such using `indenting` and `dedenting`
   */
  countPrespace: function(line){
    if(this.indentStyle === '' && line != null){
      this.indentStyle = line;
    }

    if(this.indentStyle === '') { return ; }
    var i = 0;
    while(
      line.substr(
        i * this.indentStyle.length,
        this.indentStyle.length
      ) === this.indentStyle
    ) i++;

    if(i > this.indent){
      this.indenting = true;
      this.dedenting = false;
    } else if (i < this.indent){
      this.indenting = false;
      this.dedenting = true;
    } else {
      this.indenting = false;
      this.dedenting = false;
    }
  },

  rules: function(){
    var INIT = this.lexer.state();
    Tokenizer.Tokens.forEach(function(rule){
      INIT(rule.regex)(function(match){
        var token = new rule(match, this);
        token.position = this.currentPosition();
        token.skip = token.skip || function(){
          return {lines: 0, columns: match.length};
        };
        this.advance(token.skip());
        return token;
      }.bind(this));
    }, this);
  }
});

var T = require('./helpers').Tokens;

Tokenizer.Tokens = [
  T.NewLine, T.Whitespace,
  T.MultiComment, T.SingleComment,

  T.Heredoc, T.Operator, T.Regex,

  T.Identifier, T.NumberTok, T.StringTok,

  T.Open, T.Close, T.Comma,

  T.Unknown
]

module.exports = Tokenizer;
