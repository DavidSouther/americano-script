var Tokenizer = require('./tokenizer');
var Grammar = require('./grammar');

function AmericanoCompiler(options){
  this.options = options;
  // this.tokenizer = new Tokenizer();
  this.grammar = new Grammar();
}

AmericanoCompiler.prototype = Object.create({
  compile: function(source){
    // var tokens = this.tokenizer.tokenize(source);
    // return tokens.toString();

    this.grammar.reset(source);
    var tree = this.grammar.parse();

    // Walker phases
    [
      'prototype',
      'control',
      'alias',
      'existential',
      // 'range',
      'semicolons',
    ].forEach(function(name){
      var walker = require('./walkers/' + name);
      walker.walk(tree);
    });

    var toC = function(_){
      debugger
      return _.toCode();
    };
    return tree.map(toC).join('');
  }
});

AmericanoCompiler.FILE_EXTENSIONS = [
  // '.acs',
  // '.litacs'
]

module.exports = {
  AmericanoCompiler: AmericanoCompiler,
  FILE_EXTENSIONS: AmericanoCompiler.FILE_EXTENSIONS,
  compiler: null,
  compile: function(source, options){
    this.compiler = new AmericanoCompiler(options);
    return this.compiler.compile(source);
  },
  getSourceMap: function(){
    return this.compiler.lastSourceMap;
  }
};
