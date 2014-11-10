var source =
    "OPERATOR = /// ^ (\n" +
    "  ?: [-=]>             # function\n" +
    "   | [-+*/%<>&|^!?=]=  # compound assign / compare\n" +
    "   | >>>=?             # zero-fill right shift\n" +
    "   | ([-+:])\1         # doubles\n" +
    "   | ([&|<>])\2=?      # logic / shift\n" +
    "   | \?\.              # soak access\n" +
    "   | \.{2,3}           # range or splat\n" +
    ") ///\n" ;


var expected = "OPERATOR = /^(?:[-=]>|[-+*\/%<>&|^!?=]=|>>>=?|([-+:])\1|([&|<>])\2=?|\?\.|\.{2,3})/;\n";

var compiler = require('../lib/americano');

describe('ES6 Source', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
