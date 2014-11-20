var source =
    "Subclass:: = Object.create(Superclass::)\n" +
    "Array::map.call(arrayLike, func)\n" ;

var expected =
    "Subclass.prototype = Object.create(Superclass.prototype)\n" +
    "Array.prototype.map.call(arrayLike, func)\n" ;

var compiler = require('../lib/americano');

describe('Prototypes', function(){
    it('replace correctly', function(){
        expected.should.equal(compiler.compile(source));
    });
});
