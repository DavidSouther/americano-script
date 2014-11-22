function AmericanoCompiler(options){
};

AmericanoCompiler.prototype = {
    /**
     * The main compile function. This is a line-oriented lexer+compiler+codegen
     * all in one. It is a terrible design.
     */
    compile: function (source) {
        var line, x, regex, startline;
        this.indent = this.inBlock = this.level = 0;
        this.indentStyle = '';

        // First thing we do - get some lines!
        this.inlines = source.replace(/\n+$/, '').split('\n');
        this.outlines = [];

        // We'll operate on each line exactly once.
        for (var i = 0, q = this.inlines.length; i < q; i++) {
            var j = this.reentrant(i);
            if ( j > i ) {
                i = j;
                continue;
            }

            line = this.inlines[i];

            // Blocking handles the indent level, and most of the braces.
            this.blocking(line, i);
            // Syntax handles all the other little things we do to the lines.
            line = this.syntax(line, i);
            line = this.addSemis(line, i); // This should always be last

            this.outlines.push(line);
        }

        // If we're still at an indent level, move it back.
        while(this.indent-- > 0){
            this.outlines.push(this.prespace() + '}');
        }
        this.outlines.push('');
        return this.outlines.join('\n');
    },

    reentrant: function(i){
        var j;
        // j = this.heredocs(i);
        // if ( j > i ) {
        //     return j;
        // }
        //
        // j = this.blockRegex(i);
        // if ( j > i ) {
        //     return j;
        // }

        j = this.blockComment(i);
        if ( j > i ) {
            return j;
        }

        return i;
    },

    heredocs: function(i){
        var line = this.inlines[i];
        if (line.indexOf('"""') > -1) {
            // Replace open
            line = line.replace('"""', '`');
            this.outlines.push(line);
            while ((line = this.inlines[++i]).indexOf('"""') === -1) {
                line = line.replace('#{', '${');
                this.outlines.push(line);
            }
            line = line.replace('"""', '`');
            this.outlines.push(line);
        }
        return i;
    },

    blockRegex: function(i){
        var line = this.inlines[i];
        if ((x = line.indexOf('///')) > -1) {
            startline = line.substr(0, x);
            regex = 'new RegExp(\'';
            regex += this.parseRegexPart(line.substr(x + 3));

            while ((x = (line = this.inlines[++i]).indexOf('///')) === -1) {
                regex += this.parseRegexPart(line);
            }

            regex += this.parseRegexPart(line.substr(0, x));
            regex += line.substr(x).replace(/\/\/\/([gimy]+)?/, '\', \'$1\')');

            this.outlines.push(startline + regex + ';');
        }
        return i;
    },

    blockComment: function(i){
        var line = this.inlines[i];
        if (line.indexOf('/*') > -1) {
            this.outlines.push(line);
            while ((line = this.inlines[++i]).indexOf('*/') === -1) {
                this.outlines.push(line);
            }
            this.outlines.push(line);
        }
        return i;
    },

    blocking: function(line, i){
        var j = this.outlines.length - 1;
        // countPrespace handles the indent/dedent checks
        this.indent = this.countPrespace(line);

        if (this.indenting) {
            // Moving in, we need to keep track of a few things.
            var lastLine = this.outlines[j] || '';
            var lastChar = lastLine.charAt(lastLine.length - 1);
            if(AmericanoCompiler.BLOCK_OPEN.indexOf(lastChar) > -1){
                // Step a level deeper into explicit blocks.
                this.inBlock += 1;
            } else {
                // Psych! Not a standalone line. Remove any semis  and
                // add a brace.
                this.outlines[j] =  lastLine.replace(/;$/, '') + ' {';
                this.level = this.indent;
            }
        } else if (this.dedenting) {
            if (this.inBlock > 0) {
                // Dedenting from an explicit block
                this.inBlock -= 1;
            } else {
                // We might jump several levels back in the dedent.
                // Add that many close braces.
                while (this.level > this.indent) {
                    this.level -= 1;
                    this.outlines.push(this.prespace(this.level) + '}');
                }
            }
        }
        return this;
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
     * Process part of a line for regex activity.
     */
    parseRegexPart: function(line){
        var x, code, markers = [], m = 0;

        line = line.replace(/\/\/.*$/, ''); // Strip comments

        // Save the code blocks, with spaces
        line = line.replace(/#\{([^}]+)}/g, function(block, code, offset){
            markers[offset] = this.syntax(code);
            return '#{' + offset + '}';
        }.bind(this));

        line = line.replace(/\s+/g, ''); // Shorten spaces
        line = line.replace(/'/g, "\\'"); // Escape Single Quotes

        // Inject the code blocks
        line = line.replace(/#\{(\d+)}/, function(block, m, offset){
            return '\' + (' + markers[m] + ') + \'';
        }.bind(this));

        return line;
    },

    syntax: function(line){
        // One of these for each replacement type. This implies new syntax
        // can only be on one line (at this time).
        line = this.prototypes(line);
        line = this.wrapControlBlocks(line);
        line = this.replaceAliases(line);
        line = this.existentials(line);
        line = this.splices(line);

        return line;
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
     * will work just fine.
     */
    replaceAliases: function(line){
        var token, alias;
        var tokens = this.splitTokens(line);

        for (var i = 0 ; i < tokens.length; i++ ) {
            if ( tokens[i].type !== 'root' ) {
                continue;
            }
            for (token in AmericanoCompiler.ALIASES) {
                alias = AmericanoCompiler.ALIASES[token];
                var reg = new RegExp('(\\b)' + token + '(\\b)', 'g');
                tokens[i].value = tokens[i].value.replace(reg, '$1' + alias + '$2');
            }
        }
        return tokens.map(function(_){return _.value;}).join('');
    },

    wrapControlBlocks: function(line){
        var parts;
        var blocks = AmericanoCompiler.CONTROL_BLOCKS.join('|');
        var controlRegex = new RegExp('^(.+\\s)?(' +  blocks + ')\\s(.+)$');
        if (parts = line.match(controlRegex)) {
            line = parts[2] + ' ( ' + parts[3] + ' )';
            if (parts[1]) {
                line = parts[1] + line;
            }
        }
        return line;
    },

    existentials: function(line){
        if (line.indexOf('?') == -1) { return line; } // Nothing to do

        var tokens = this.splitTokens(line), parts, value;

        for(var i = 0 ; i < tokens.length ; i++){
            if ( tokens[i].type !== 'root' ) {
                continue;
            }

            // End-of-expression case
            if (parts = tokens[i].value.match(/^([^\?\.]+)\?$/)) { // Should be identifier?
                if (tokens[i].value.indexOf('.') > -1){
                    tokens[i].value = '' + parts[1] + ' != null'
                } else {
                    tokens[i].value = 'typeof ' + parts[1] + ' !== "undefined" && ' + parts[1] + ' !== null';
                }
                continue;
            }

            // middle-of-expression
            if (tokens[i].value.indexOf('?') > -1) {
                parts = tokens[i].value.split('?');
                var varline = 'var ';
                for (var j = 0; j < parts.length - 1; j++) {
                    varline += '_ref' + j + ', '
                }
                varline = varline.substr(0, varline.length - 2) + ';';
                this.outlines.push(varline);

                tokens[i].value = expandTokens(parts);

                continue;
            }

        }
        return tokens.map(function(_){return _.value;}).join('');

        function expandTokens(parts, i){
            var assign;
            i = i || 0;
            if(parts.length === 1){
                return '_ref' + (i - 1) + parts[0];
            } else {
                if(i === 0){
                    assign = '_ref0 = ' + parts[0];
                } else {
                    assign = '_ref' + i + ' = ' + '_ref' + (i-1) + parts[0];
                }
                return '(' + assign + ') != null ? ' + expandTokens(parts.slice(1), i+1) + ' : void 0';
            }
        }
    },

    splices: function(line){
        if (!line.match(/\[[^\]]+\.\.[^\]]+\]/)) { return line; }

        spliceRegex = /\[\s*([^\s]*[^\s\.])\s*(\.{2,3})\s*([^\s\]]+)?\s*\](?:\s+=\s+([^\s]+|\[[^\]]+\]))?/g;

        line = line.replace(spliceRegex, spliceReplacer);

        return line;

        function spliceReplacer(splice, min, type, max, replace, offset) {
            if ( replace ) {
                // Splicing something in
                if ( !max ) {
                    max = '9e9';
                }
                return '.splice(' + min + ', ' + max + ' - ' + min + (type == '..' ? ' + 1' : '') + ', ' + replace + ')';
            } else {
                // Slicing something off
                if ( !max ) {
                    return '.slice(' + min + ')';
                } else if ( type == '...' ){
                    return '.slice(' + min + ', ' + max + ')';
                } else {
                    return '.slice(' + min + ', +' + max + ' + 1 || 9e9)';
                }
            }
        }
    },

    prototypes: function(line){
        line = line.replace(
            new RegExp(
                '(' + AmericanoCompiler.IDENTIFIER + ')::(' +
                AmericanoCompiler.IDENTIFIER + ')'
            , 'g'),
            '$1.prototype.$2'
        );
        line = line.replace(
            new RegExp('(' + AmericanoCompiler.IDENTIFIER + ')::', 'g'),
            '$1.prototype'
        );
        return line;
    },

    /**
     * Split a sting into array of tokens, treating regex /../f and strings '..'
     * ".." as one token. This is the closest to a real lexer we have.
     */
    splitTokens: function(line, ln) {
        var state, tokens = [], j = -1, x, l = '';

        var states = {};

        states['root'] = core(/\s/, 'space');
        states['space'] = core(/\S/, 'root');

        for ( var k = 0 ; k < AmericanoCompiler.QUOTE.length; k++ ) {
            var q = AmericanoCompiler.QUOTE[k];
            states[q] = quoter(q);
        }

        transitionTo('root');
        for(var i = 0; i < line.length; i++){
            x = line.charAt(i);
            states[state]();
            l = x;
        }

        return tokens;

        function transitionTo(s){
            state = s;
            tokens[++j] = {
                value: '',
                type: s == ('root' || 'space') ? s : 'quote',
                position: {
                    line: ln,
                    column: i
                }
            };
        }

        function take(x){
            tokens[j].value += x;
        }

        function core(reg, to){
            return function () {
                if ( x.match(reg) ) {
                    transitionTo(to);
                }
                if ( states[x] ) {
                    transitionTo(x);
                }
                take(x);
            }
        }

        function quoter(q){
            return function(){
                take(x);
                if(x === q && l !== '\\') {
                    transitionTo('root');
                }
            }
        }
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
    ',', ';', '+', '-', '/', '*', '='
]
.concat(AmericanoCompiler.BLOCK_OPEN)
.concat(AmericanoCompiler.BLOCK_CLOSE)

AmericanoCompiler.CONTROL_BLOCKS = [
    'if', 'for', 'while', 'switch'
]

AmericanoCompiler.QUOTE = [
    '"', "'", '/'
]

AmericanoCompiler.ALIASES = {
    'and': '&&',
    'or': '||',
    'is': '===',
    'fn': 'function'
}

AmericanoCompiler.IDENTIFIER = '(?:[$A-Za-z_\x7f-\uffff][$\w\x7f-\uffff]*)(?:[^\n\S]*:(?!:))?'

AmericanoCompiler.FILE_EXTENSIONS = [
    '.acs',
    '.litacs',
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
