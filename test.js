var source = "/*\n * Comment\n*/\nfn(foo)\n  return foo + foo\n";

var expected = "/*\n * Comment\n*/\nfunction(foo) {\n  return foo + foo;\n}\n";

var compiler = require('./lib/americano');
debugger
var compiled = compiler.compile(source)

console.log(expected);
console.log(compiled);
