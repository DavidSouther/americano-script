var source =
    "OPERATOR = /// ^ (\n" +
    "  ?: [-=]>             // function\n" +
    "   | [-+*/%<>&|^!?=]=  // compound assign / compare\n" +
    "   | >>>=?             // zero-fill right shift\n" +
    "   | ([-+:])\1         // doubles\n" +
    "   | ([&|<>])\2=?      // logic / shift\n" +
    "   | \?\.              // soak access\n" +
    "   | \.{2,3}           // range or splat\n" +
    "   | #{foo}            // Variable Interpolation\n" +
    "   | 'literal'         // literal with quotes\n" +
    ") ///ig\n" ; // Flags

var expected = "OPERATOR = new RegExp('^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?\.|\.{2,3}|' + (foo) + '|\\'literal\\')', 'ig');\n";

var compiler = require('../lib/americano');

describe('Block Regex', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
