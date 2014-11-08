function AmericanoCompiler(options){
};

AmericanoCompiler.prototype = {
    compile: function (source){
        var line, inBlock = false, level = 0;
        // Perform as a line-based parser for first round of indent/dedent.
        this.indent = 0;
        this.indentStyle = '';
        this.inlines = source.replace(/\n+$/, '').split('\n');
        this.outlines = [];
        for (var i = 0, j, q = this.inlines.length; i < q; i++) {
            line = this.inlines[i];
            j = this.outlines.length;
            this.indent = this.countPrespace(line);
            if(this.indenting){
                var lastLine = this.outlines[i - 1]
                var lastChar = lastLine.charAt(lastLine.length - 1);
                if(AmericanoCompiler.BLOCK_OPEN.indexOf(lastChar) > -1){
                    // Already starting a block, so don't actually need
                    // to be indending.
                    //
                    // Need to mark this block as non-dedent...
                    inBlock = true;
                } else {
                    this.outlines[j - 1] =  lastLine.replace(';', '') + ' {';
                    level += 1;
                }
            } else if (this.dedenting){
                if(inBlock){
                    inBlock = false;
                } else {
                    while (level > this.indent) {
                        level -= 1;
                        this.outlines.push(this.prespace(level) + '}');
                    }
                }
            }
            line = this.replaceAliases(line);
            line = this.addSemis(line);
            this.outlines.push(line);


        }

        while(this.indent-- > 0){
            this.outlines.push(this.prespace() + '}');
        }
        this.outlines.push('');
        return this.outlines.join('\n');
    },

    checkIndent: function(line){
        var indent = (line.match(/^(\s+)/) || [])[1];
        if(this.indentStyle === '' && indent != null){
            this.indentStyle = indent;
        }
    },

    countPrespace: function(line){
        this.checkIndent(line);
        if(this.indentStyle === '') { return 0; }
        if(line.length === 0){
            this.indenting = false;
            this.dedenting = false;
            return this.indent;
        }
        var i = 0;
        while(
            line.substr(
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
    },
    prespace: function(depth){
        var space = '';
        depth = depth || this.indent;

        for(i = 0; i < depth; i++){
            space += this.indentStyle;
        }
        return space;
    },

    addSemis: function(line){
        line = line.replace(/\s*$/, '');
        if(line.length === 0){ return line };
        var lastChar = line.charAt(line.length - 1);
        if(AmericanoCompiler.SAFE_LINE_END.indexOf(lastChar) === -1){
            line = line + ';'
        };
        return line;
    },

    replaceAliases: function(line){
        var token, alias;
        for(token in AmericanoCompiler.ALIASES){
            alias = AmericanoCompiler.ALIASES[token];
            var reg = new RegExp('(\\s)' + token + '(\\s)', 'g');
            line = line.replace(reg, '$1' + alias + '$2');
        }
        return line;
    }
};

AmericanoCompiler.BLOCK_OPEN = [
    '{', '[', '('
]
AmericanoCompiler.BLOCK_CLOSE = [
    '}', ']', ')'
]
AmericanoCompiler.SAFE_LINE_END = [
    ',', ';',
]
.concat(AmericanoCompiler.BLOCK_OPEN)
.concat(AmericanoCompiler.BLOCK_CLOSE)


AmericanoCompiler.ALIASES = {
    'and': '&&',
    'or': '||',
    'is': '===',
}

module.exports = {
    AmericanoCompiler: AmericanoCompiler,
    compiler: null,
    compile: function(source, options){
        this.compiler = new AmericanoCompiler(options);
        return this.compiler.compile(source);
    }
};
