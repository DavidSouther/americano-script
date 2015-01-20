var source = "\"\"\"\nThis is a #{heredoc}\n\"\"\"\n";

var expected = "`\nThis is a ${heredoc}\n`;\n";

var compiler = require('../lib/americano');

describe('Heredocs', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });

    it('differentiates in and out of string', function(){
        source =
            'if line.indexOf(\'"""\') > -1\n' +
            '  // Replace open\n' +
            '  line = line.replace(\'"""\', \'`\')\n'
            ;
        expected =
            'if (line.indexOf(\'"""\') > -1) {\n' +
            '  // Replace open\n' +
            '  line = line.replace(\'"""\', \'`\');\n' +
            '}\n'
            ;
        compiler.compile(source).should.equal(expected);
    })
});
