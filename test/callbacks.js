var source =
    "server.listen port, function()\n" +
    "    foo.doStuff()";

var expected =
    "server.listen(port, function(){\n" +
    "    foo.doStuff()" +
    "})";

var compiler = require('../lib/americano');

describe('Callbacks', function(){
    it('expand correctly', function(){
        expected.should.equal(compiler.compile(source));
    });
});
