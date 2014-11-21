var compiler = require('../lib/americano');

describe('Existential operator', function(){
    it('expands single arg correctly', function(){
        compiler.compile("foo?\n").should.equal(
            "typeof foo !== \"undefined\" && foo !== null;\n"
        );
    });

    it('expands several correctly', function(){
        compiler.compile("if foo.bar?.baz?.foo?").should.equal(
            "var _ref0, _ref1, _ref2;\nif ( (_ref0 = foo.bar) != null ? (_ref1 = _ref0.baz) != null ? (_ref2 = _ref1.foo) != null ? _ref2 : void 0 : void 0 : void 0 )\n"
        );
    });

    it('does not expand ? in string or regex', function(){
        compiler.compile("var foo = 'To be? or not to be?'").should.equal(
            "var foo = 'To be? or not to be?'"
        );
    })
});
