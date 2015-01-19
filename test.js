var source =
"Subclass:: = Object.create(Superclass::)\n" +
"Array::map.call(arrayLike, func)\n" ;

var expected =
"Subclass.prototype = Object.create(Superclass.prototype);\n" +
"Array.prototype.map.call(arrayLike, func);\n";

var compiler = require('./lib/americano');
debugger
var compiled = compiler.compile(source)

console.log(expected);
console.log(compiled);
