var source =
    "class Greeter\n" +
    "    constructor(public greeting: string) { }\n" +
    "    greet()\n" +
    "        return \"<h1>\" + this.greeting + \"</h1>\"\n" +
    "var greeter = new Greeter(\"Hello, world!\")\n" +
    "var str = greeter.greet()\n" +
    "document.body.innerHTML = str\n"

var expected =
    "class Greeter {\n" +
    "    constructor(public greeting: string) { }\n" +
    "    greet() {\n" +
    "        return \"<h1>\" + this.greeting + \"</h1>\";\n" +
    "    }\n" +
    "}\n" +
    "var greeter = new Greeter(\"Hello, world!\");\n" +
    "var str = greeter.greet();\n" +
    "document.body.innerHTML = str;\n"

var compiler = require('../lib/americano');

describe('TypeScript Source', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
