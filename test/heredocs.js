var source = "\"\"\"\nThis is a #{heredoc}\n\"\"\"\n";

var expected = "`\nThis is a ${heredoc}\n`\n";

var compiler = require('../lib/americano');

describe('Heredocs', function(){
    it('compile sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
