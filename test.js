source =
'fn* gen(i)\n' +
'  while true\n' +
'    yield i++\n'+
'    yield* anotherGen(i)\n'
;
expected =
'function* gen(i) {\n' +
'  while ( true ) {\n' +
'    yield i++;\n' +
'    yield* anotherGen(i);\n' +
'  }\n' +
'}\n'
;

var compiler = require('./lib/americano');
debugger
var compiled = compiler.compile(source)

console.log(expected);
console.log(compiled);
