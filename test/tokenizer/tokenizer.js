describe('Tokenizer', function(){
  it('tokenizes', function(){
    var Tokenizer = require('../../lib/tokenizer');
    var tokenizer = new Tokenizer();

    var source = "var foo = 'bars';\nfunction FooBar(){\n  return foo + bar;\n}\n//COMMENT\n/*\n * MCOM\n */\nvar jkl = -123.65\n";

    var tokens = tokenizer.tokenize(source);
    tokens.map(function(_){
      return _.toString() + "@" + _.position.line + ":" + _.position.column;
    }).should.eql([
      'IDENT(var)@1:0',
      'SPACE(1, CLEAN)@1:3',
      'IDENT(foo)@1:4',
      'SPACE(1, CLEAN)@1:7',
      'OP(=)@1:8',
      'SPACE(1, CLEAN)@1:9',
      'STRING(\'bars\')@1:10',
      'UKN(;)@1:16',
      'NL(0)@1:17',
      'IDENT(function)@2:0',
      'SPACE(1, CLEAN)@2:8',
      'IDENT(FooBar)@2:9',
      'Open()@2:15',
      'Close()@2:16',
      'Open()@2:17',
      'NL(2)@2:18',
      'IDENT(return)@3:2',
      'SPACE(1, CLEAN)@3:8',
      'IDENT(foo)@3:9',
      'SPACE(1, CLEAN)@3:12',
      'OP(+)@3:13',
      'SPACE(1, CLEAN)@3:14',
      'IDENT(bar)@3:15',
      'UKN(;)@3:18',
      'NL(0)@3:19',
      'Close()@4:0',
      'NL(0)@4:1',
      'COM(COMMENT)@5:0',
      'NL(0)@5:9',
      'MCOM(/*\n * MCOM\n */)@6:0',
      'NL(0)@9:3',
      'IDENT(var)@10:0',
      'SPACE(1, CLEAN)@10:3',
      'IDENT(jkl)@10:4',
      'SPACE(1, CLEAN)@10:7',
      'OP(=)@10:8',
      'SPACE(1, CLEAN)@10:9',
      'OP(-)@10:10',
      'NUM(123.65)@10:11',
      'NL(0)@10:17'
    ]);
  });
});
