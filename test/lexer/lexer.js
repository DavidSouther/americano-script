describe('Lexer', function(){
  it('does lexy things', function(){
    var Lexer = require('../../lib/lexer');
    var lexer = new Lexer();
    var INIT = lexer.state();

    function NUM(string){
      this.number = parseFloat(string);
      this.toString = function() { return "NUM(" + this.number + ")" ; };
    }

    function ID(string){
      this.name = string;
      this.toString = function() { return "ID(" + this.name + ")" ; };
    }

    function SPACE(string){
      this.length = string.length;
      this.mixed = (string.indexOf('\s') > -1) && (string.indexOf('\t') > -1);
      this.toString = function(){
        var state = this.mixed ? 'MIXED' : 'CLEAN';
        return "SPACE(" + this.length + ", " + state + ")";
      };
    }

    TOKEN = function(regex, Ctor){
      INIT(regex)(function(match){
        return new Ctor(match);
      })
    };

    TOKEN(/[A-Za-z_]+/, ID);
    TOKEN(/[0-9]+/, NUM);
    TOKEN(/\s+/, SPACE);
    INIT(/$/, function(match){
      lexer.done();
    });

    lexer.reset("foo bar 123 baz");
    var tokens = [];
    while(lexer.hasNext()){
      tokens.push(lexer.next().toString());
    }
    tokens.should.eql([
      'ID(foo)',
      'SPACE(1, CLEAN)',
      'ID(bar)',
      'SPACE(1, CLEAN)',
      'NUM(123)',
      'SPACE(1, CLEAN)',
      'ID(baz)'
    ])
  });
});
