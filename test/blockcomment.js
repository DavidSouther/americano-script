var source = "/*\n * Comment\n*/\nfn(foo)\n  return foo + foo\n";

var expected = "/*\n * Comment\n*/\nfunction(foo) {\n  return foo + foo;\n}\n";

var compiler = require('../lib/americano');

describe('Block Comments', function(){
    it('are ignored', function(){
        compiler.compile(source).should.equal(expected);
    });
});
