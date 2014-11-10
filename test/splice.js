var compiler = require('../lib/americano');

describe('Splices', function(){
    var cases = {
        "foo.bar[i .. ]": "foo.bar.slice(i);\n",
        "foo.bar[ i .. j ]": "foo.bar.slice(i, +j + 1 || 9e9);\n",
        "foo.bar[m...n] = []": "[].splice.apply(foo.bar, [m, n - m].concat(_ref = [])), _ref;\n",
        "foo.bar[m ... n][i..j] = []": "[].splice.apply(foo.bar.slice(m, n), [i, j - i + 1].concat(_ref1 = [])), _ref1;\n",
        "[a...b]": "(function() { var _results = []; for (var _i = a; a <= b ? _i < b : _i > b; a <= b ? _i++ : _i--){ _results.push(_i); } return _results; }).apply(this);\n",
        "[a..b]": "(function() { var _results = []; for (var _j = a; a <= b ? _j <= b : _j >= b; a <= b ? _j++ : _j--){ _results1.push(_j); } return _results1; }).apply(this);\n",
    };

    it('slices and splices and dices', function(){
        for(var source in cases){
            compiler.compile(source).should.equal(cases[source]);
        }
    })
});
