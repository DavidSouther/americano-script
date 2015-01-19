var source =
    "var Path = require('path')\n" +
    "module.exports = function bootstrapConfig(config)\n" +
    "    config.vendors = config.vendors or {}\n" +
    "    config.vendors.prefix = config.vendors.prefix or []\n" +
    "    config.vendors.prefix.push(Path.resolve(__dirname, '../node_modules'))\n" +
    "\n" +
    "    config.vendors.js = (config.vendors.js or []).concat([\n" +
    "        'jquery/dist/jquery.js',\n" +
    "        'bootstrap/dist/js/bootstrap.js',\n" +
    "    ])\n" +
    "\n" +
    "    config.vendors.css = (config.vendors.css or []).concat([\n" +
    "        'bootstrap/dist/css/bootstrap.css',\n" +
    "        'bootstrap/dist/css/bootstrap-theme.css',\n" +
    "    ])\n" +
    "    return config\n";


var expected =
    "var Path = require('path')\n" +
    "module.exports = function bootstrapConfig(config) {\n" +
    "    config.vendors = config.vendors || {}\n" +
    "    config.vendors.prefix = config.vendors.prefix || []\n" +
    "    config.vendors.prefix.push(Path.resolve(__dirname, '../node_modules'))\n" +
    "\n" +
    "    config.vendors.js = (config.vendors.js || []).concat([\n" +
    "        'jquery/dist/jquery.js',\n" +
    "        'bootstrap/dist/js/bootstrap.js',\n" +
    "    ])\n" +
    "\n" +
    "    config.vendors.css = (config.vendors.css || []).concat([\n" +
    "        'bootstrap/dist/css/bootstrap.css',\n" +
    "        'bootstrap/dist/css/bootstrap-theme.css',\n" +
    "    ])\n" +
    "    return config;\n" +
    "}\n";

var compiler = require('../lib/americano');

describe.skip('ES5 Source', function(){
    it('compiles sanely', function(){
        compiler.compile(source).should.equal(expected);
    });
});
