var compiler = require('../lib/americano');

describe('Existential operator', function(){
    it('expands single arg correctly', function(){
        compiler.compile("foo?\n").should.equal(
            "typeof foo !== \"undefined\" && foo !== null;\n"
        );
    });

    it('expands several correctly', function(){
        compiler.compile("if foo.bar?.baz?.foo?").should.equal(
            "if (((_ref0 = foo.bar) != null ? (_ref1 = _ref0.baz) != null ? _ref1.foo : void 0 : void 0) != null) ;"
        )
    })
});
