var source =
    "@Component()\n" +
    "class MyApp\n" +
    "  server:Server\n" +
    "  @Bind('name') name:string\n" +
    "  @Event('foo') fooFn:Function\n" +
    "\n" +
    "  @Inject()\n" +
    "  constructor(@parent server:Server) {}\n" +
    "  greet():string {}\n";

var expected =
    "@Component();\n" +
    "class MyApp {\n" +
    "  server:Server;\n" +
    "  @Bind('name') name:string;\n" +
    "  @Event('foo') fooFn:Function;\n" +
    "\n" +
    "  @Inject();\n" +
    "  constructor(@parent server:Server) {}\n" +
    "  greet():string {}\n" +
    "}\n";

var compiler = require('../lib/americano');

describe('AtScript Source', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
