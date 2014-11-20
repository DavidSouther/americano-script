var source =
    "if foo is bar\n" +
    "  camel()"

var expected =
    "if ( foo === bar ) {\n" +
    "  camel()\n" +
    "}\n"

var compiler = require('../lib/americano');
describe('Control statements', function(){
    it('compiles if', function(){
        compiler.compile(source).should.equal(expected);
    });
});
