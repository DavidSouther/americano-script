function Lexer(input){
  this.rules = [];
  this._lastMatch = null;
  this.reset(input || '');
}

Lexer.prototype = Object.create({
  state: function(){
    return function(regex){
      return function(action){
        this.rules.push(new Rule(regex, action));
      }.bind(this);
    }.bind(this);
  },

  reset: function(input){
    this.input = input;
    this.consumed = 0;
  },

  done: function(){
    this.input = 0;
    this._lastMatch = null;
  },

  peek: function(){
    if ( !this._lastMatch ) {
      // Only evaluate once per take
      var match = {
        rule: null,
        string: '',
        length: -1
      };

      // Iterate last to first, but earlier of same length takes precedence
      for ( var i = this.rules.length - 1 ; i >= 0; --i) {
        var r = this.rules[i];
        var m = this.input.match(r.regex);

        if ( m && m[0].length >= match.length ) {
          match = {
            rule: r,
            string: m[0],
            length: m[0].length
          }
        }
      }

      this._lastMatch = match;
    }
    match = this._lastMatch;
    return match.rule && match.rule.action(match.string);
  },

  consume: function(){
    if (this._lastMatch && this._lastMatch.rule && this._lastMatch.length > -1) {
      this.consumed += this._lastMatch.length;
      this.input = this.input.substring(this._lastMatch.length);
      this._lastMatch = null;
    }
  },

  hasNext: function(){
    var peek = this.peek();
    return this.input.length > 0 && peek;
  },

  next: function(){
    var peek = this.peek();

    if ( peek ) {
      this.consume();
      return peek;
    } else {
      throw new Error("Could not lex: " + this.input);
    }
  },
});


function Rule(regex, action){
  this.regex = new RegExp("^(" + regex.source + ")");
  this.action = action;
}

Rule.prototype.matches = function(input){
  var match = input.matches(this.regex);
  if (match) {
    match.shift(); // Don't want the full match, only the first pattern
  }
  return match;
};

module.exports = Lexer;
