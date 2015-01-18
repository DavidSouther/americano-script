var Tokens = require('./tokenizer').Tokens;

function Grammar(){
  this.reset();
}

Grammar.prototype = Object.create({
  reset: function(){
    this.stack = [];
    this.blocks = [];
    this.partsInBlock = 0;
    this.indentStyle = '';
    this.indent = 0;
    this.level = 0;
  },
  parse: function(tokens){
    var lineTokens = 0, line, token, indent;
    for(var i = 0; i<tokens.length; i++){
      token = tokens[i];
      if ( token instanceof Tokens.NewLine ) {
        line = [];
        while(--lineTokens >= 0){ line.unshift(this.stack.pop()); }
        this.stack.push(new Line(line));
        this.partsInBlock += 1;
        lineTokens = 0;

        while ( token instanceof Tokens.NewLine && i < tokens.length ) {
          this.stack.push(token);
          this.partsInBlock += 1;
          i += 1;
          token = tokens[i];
        }

        if(token instanceof Tokens.Whitespace){
          this.blocking(tokens[i]);
          this.stack.push(token);
          this.partsInBlock += 1;
        } else {
          this.blocking(new Tokens.Whitespace(''));
          i -= 1;
        }
      } else {
        lineTokens += 1;
        this.stack.push(token);
      }
    }

    return new Program(this.stack);
  },

  reduce: function(tokens){
    return tokens;
  },

  blocking: function(line){
    this.indent = this.countPrespace(line);

    if (this.indenting) {
      var isOpen = this.stack[this.stack.length - 2].isBlockOpen || function(){
        return false;
      };
      if(isOpen()) {
        // Step a level deeper into explicit blocks.
        this.blocks.push(this.partsInBlock);
        this.partsInBlock = 0;
      }
    } else if (this.dedenting) {
      // We might jump several levels back in the dedent.
      // Add that many close braces.
      this.blocks.push(this.partsInBlock);
      this.partsInBlock = 0;
      while (this.blocks.length > this.indent + 1) {
        var block = [];
        var parts = this.blocks.pop();
        while(parts-- >= 0){
          block.unshift(this.stack.pop());
        }
        this.stack.push(new Block(block));
        this.level -= 1;
      }
    }
  },

  /**
  * This little helper will keep checking for leading whitespace. If no
  * leading whitespace has been found, however much is here will be used for
  * the rest of the parse as the official indent level.
  */
  checkIndent: function(indent){
    if(this.indentStyle === '' && indent != null){
      this.indentStyle = indent;
    }
  },

  /**
  * Figure out how deep in the block scope we are based on indent level, and
  * if we just went deeper mark as such using `indenting` and `dedenting`
  */
  countPrespace: function(line){
    this.checkIndent(line.space);
    if(this.indentStyle === '') { return 0; }
    // if(line.length === 0){
    //   this.indenting = false;
    //   this.dedenting = false;
    //   return this.indent;
    // }
    var i = 0;
    while(
      line.space.substr(
        i * this.indentStyle.length,
        this.indentStyle.length
      ) === this.indentStyle
    ) i++;

    if(i > this.indent){
      this.indenting = true;
      this.dedenting = false;
    } else if (i < this.indent){
      this.indenting = false;
      this.dedenting = true;
    } else {
      this.indenting = false;
      this.dedenting = false;
    }

    return i;
  }
});

function Line(tokens){
  this.tokens = tokens;
}

Line.prototype.isBlockOpen = function(){
  return true;
};

Line.prototype.toString = function(){
  var s = "LINE(";
  this.tokens.forEach(function(token){
    s += token.toString() + ' ';
  });
  s += ")\n"
  return s;
}
Line.prototype.toCode = function(){
  var s = "";
  this.tokens.forEach(function(token){
    s += token.toCode();
  });
  return s;
};

function Block(parts){
  this.parts = parts;
}

Block.prototype.toString = function(){
  var s = "BLOCK(";
  this.parts.forEach(function(part){
    s += part.toString();
  });
  s += ')\n';
  return s;
};

Block.prototype.toCode = function(){
  var s = " {";
  this.parts.forEach(function(part){
    s += part.toCode();
  });
  s = s.replace(/\n\n$/, '\n}\n');
  return s;
};

function Program(statements){
  this.statements = statements;
}
Program.prototype.toCode = function(){
  var s = "";
  this.statements.forEach(function(statement){
    s += statement.toCode();
  });
  return s;
}

module.exports = Grammar;
