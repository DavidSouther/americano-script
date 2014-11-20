var compiler = require('../lib/americano');

describe('Splices', function(){
    var cases = {
        "foo.bar[i .. ]": "foo.bar.slice(i)\n",
        "foo.bar[ i ... j ]": "foo.bar.slice(i, j)\n",
        "foo.bar[ i .. j ]": "foo.bar.slice(i, +j + 1 || 9e9)\n",
        "foo.bar[m...n] = []": "foo.bar.splice(m, n - m, [])\n",
        "foo.bar[m ... n][i..j] = []": "foo.bar.slice(m, n).splice(i, j - i + 1, [])\n",
        "[a...b]": "(function() { var _ = []; for (var i = a; a <= b ? i < b : i > b; a <= b ? i+=1 : i-=1){ _.push(i); } return _; }())\n",
        "[a..b]":  "(function() { var _ = []; for (var i = a; a <= b ? i <= b : i >= b; a <= b ? i+=1 : i-=1){ _.push(i); } return _; }())\n",
        "[a..b, -2]": "(function() { var _ = []; for (var i = a; -2 > 0 ? i <= b : i >= b; a <= b ? i+=2 : i-=2){ _.push(i); } return _; }())\n",
    };

    it('slices and splices and dices', function(){
        for(var source in cases){
            compiler.compile(source).should.equal(cases[source]);
        }
    })
});
