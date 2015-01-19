var source =
    "if ((a or b) and (c is d))\n";

var expected =
    "if ((a || b) && (c === d));\n";

var compiler = require('../lib/americano');

describe('Aliases', function(){
    it('replace correctly', function(){
        compiler.compile(source).should.equal(expected);
    });

    it('handles generated function shorthand', function(){
        source =
            'fn* gen(i)\n' +
            '  while true\n' +
            '    yield i++\n'+
            '    yield* anotherGen(i)\n'
            ;
        expected =
            'function* gen(i) {\n' +
            '  while (true) {\n' +
            '    yield i++;\n' +
            '    yield* anotherGen(i);\n' +
            '  }\n' +
            '}\n'
            ;
        compiler.compile(source).should.equal(expected);
    });
});
