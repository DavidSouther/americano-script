describe('Grammar', function(){
  it('parses', function(){
    var Tokenizer = require('../../lib/tokenizer');
    var tokenizer = new Tokenizer();
    var Grammar = require('../../lib/grammar');
    var grammar = new Grammar();

    source = "var foo = 'bars'\nfunction FooBar()\n  return foo + bar\n\nvar jkl = -123.65\n";

    var tokens = tokenizer.tokenize(source);
    var tree = grammar.parse(tokens);

    tree.toCode().should.eql("var foo = 'bars'\nfunction FooBar() {\n return foo + bar\n}\nvar jkl = -123.65\n");
  });
});
