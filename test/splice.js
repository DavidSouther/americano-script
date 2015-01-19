var compiler = require('../lib/americano');

describe.skip('Splices', function(){
    var cases = {
        "foo.bar[i .. ]": "foo.bar.slice(i)\n",
        "foo.bar[ i ... j ]": "foo.bar.slice(i, j)\n",
        "foo.bar[ i .. j ]": "foo.bar.slice(i, +j + 1 || 9e9)\n",
        "foo.bar[m...n] = []": "foo.bar.splice(m, n - m, [])\n",
        "foo.bar[m ... n][i..j] = []": "foo.bar.slice(m, n).splice(i, j - i + 1, [])\n",
    };

    it('slices and splices and dices', function(){
        for(var source in cases){
            compiler.compile(source).should.equal(cases[source]);
        }
    })
});
