function AmericanoCompiler(options){
};

AmericanoCompiler.prototype = {
    /**
     * The main compile function. This is a line-oriented lexer+compiler+codegen
     * all in one. It is a terrible design.
     */
    compile: function (source) {
        var line, inBlock = 0, level = 0;
        this.indent = 0;
        this.indentStyle = '';

        // First thing we do - get some lines!
        this.inlines = source.replace(/\n+$/, '').split('\n');
        this.outlines = [];

        // We'll operate on each line exactly once.
        // - i indexes to `inlines`
        // - j indexes to `outlines`
        for (var i = 0, j, q = this.inlines.length; i < q; i++) {
            line = this.inlines[i];
            j = this.outlines.length - 1;

            // countPrespace handles the indent/dedent checks
            this.indent = this.countPrespace(line);

            if (this.indenting) {
                // Moving in, we need to keep track of a few things.
                var lastLine = this.outlines[i - 1]
                var lastChar = lastLine.charAt(lastLine.length - 1);
                if(AmericanoCompiler.BLOCK_OPEN.indexOf(lastChar) > -1){
                    // Step a level deeper into explicit blocks.
                    inBlock += 1;
                } else {
                    // Psych! Not a standalone line. Remove any semis  and
                    // add a brace.
                    this.outlines[j] =  lastLine.replace(/;$/, '') + ' {';
                    level = this.indent;
                }
            } else if (this.dedenting) {
                if (inBlock > 0) {
                    // Dedenting from an explicit block
                    inBlock -= 1;
                } else {
                    // We might jump several levels back in the dedent.
                    // Add that many close braces.
                    while (level > this.indent) {
                        level -= 1;
                        this.outlines.push(this.prespace(level) + '}');
                    }
                }
            }

            // One of these for each replacement type. This implies new syntax
            // can only be on one line (at this time).
            line = this.replaceAliases(line);
            line = this.addSemis(line);

            this.outlines.push(line);
        }

        // If we're still at an indent level, move it back.
        while(this.indent-- > 0){
            this.outlines.push(this.prespace() + '}');
        }
        this.outlines.push('');
        return this.outlines.join('\n');
    },

    /**
     * This little helper will keep checking for leading whitespace. If no
     * leading whitespace has been found, however much is here will be used for
     * the rest of the parse as the official indent level.
     */
    checkIndent: function(line){
        var indent = (line.match(/^(\s+)/) || [])[1];
        if(this.indentStyle === '' && indent != null){
            this.indentStyle = indent;
        }
    },

    /**
     * Figure out how deep in the block scope we are based on indent level, and
     * if we just went deeper mark as such using `indenting` and `dedenting`
     */
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

    /**
     * Given a depth, return a string with that much of the appropriate
     * whitespace. Uses `this.indent` as default.
     */
    prespace: function(depth){
        var space = '';
        depth = depth || this.indent;

        for(i = 0; i < depth; i++){
            space += this.indentStyle;
        }
        return space;
    },

    /**
     * Add semicolons, if the line needs it.
     */
    addSemis: function(line){
        line = line.replace(/\s*$/, '');
        if(line.length === 0){ return line };
        var lastChar = line.charAt(line.length - 1);
        if(AmericanoCompiler.SAFE_LINE_END.indexOf(lastChar) === -1){
            line = line + ';'
        };
        return line;
    },

    /**
     * Handle replacing any aliased words. Works on whole words, so `jQuery.is`
     * will work just find.
     */
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

/** Some helper lists. */
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
