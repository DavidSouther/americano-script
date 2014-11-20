var source =
    "OPERATOR = /// ^ (\n" +
    "  ?: [-=]>             // function\n" +
    "   | [-+*/%<>&|^!?=]=  // compound assign / compare\n" +
    "   | >>>=?             // zero-fill right shift\n" +
    "   | ([-+:])\1         // doubles\n" +
    "   | ([&|<>])\2=?      // logic / shift\n" +
    "   | \?\.              // soak access\n" +
    "   | \.{2,3}           // range or splat\n" +
    "   | #{foo}            // Variable Interpolation" +
    "   | 'literal'         // literal with quotes" +
    ") ///\n" ;

var expected = "OPERATOR = new RegExp('^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?\.|\.{2,3}|' + foo + '|\\'literal\\')');\n";

var compiler = require('../lib/americano');

describe('ES6 Source', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
