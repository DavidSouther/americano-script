var source = "\n";

var expected = "\n";

var compiler = require('../lib/americano');

describe('ES6 Source', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
