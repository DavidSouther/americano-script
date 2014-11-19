var source =
    "if ((a or b) and (c is d)) 3\n";

var expected =
    "if ( ((a || b) && (c === d)) 3 )\n";

var compiler = require('../lib/americano');

describe('Aliases', function(){
    it('replace correctly', function(){
        compiler.compile(source).should.equal(expected);
    });
});
