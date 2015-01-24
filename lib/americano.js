var Tokenizer = require('./tokenizer');
var Program = require('./ast/program');

function AmericanoCompiler(options){
  this.options = options;
  this.tokenizer = new Tokenizer();
  // this.grammar = new Grammar();
}

AmericanoCompiler.prototype = Object.create({
  compile: function(source){
    // var tokens = this.tokenizer.tokenize(source);
    // return tokens.toString();

    this.tokenizer.reset(source);
    debugger
    var tree = Program.consume(this.tokenizer);

    // Walker phases
    [
      'control',
      'prototype',
      'alias',
      // 'existential',
      // 'range',
      // 'semicolons',
    ].forEach(function(name){
      var walker = require('./walkers/' + name);
      walker.walk(tree);
    });

    return tree.toCode();
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
