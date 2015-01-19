function Regex(match){
  this.flags = match.match(/[giym]+$/)[0] || '';
  this.source = match.substr(0, match.length - this.flags.length).replace('///', '');
}
Regex.regex = { source: '///(.|\n)*///([giym]+)?' };
Regex.prototype.toCode = function(){
  var source = this.source.split('\n').map(this.parseRegexPart).join('');
  return 'new RegExp(\'' + source + '\', \'' + this.flags + '\')';
}
Regex.prototype.parseRegexPart = function(line){
  var x, code, markers = [], m = 0;

  line = line.replace(/\/\/.*$/, ''); // Strip comments

  // Save the code blocks, with spaces
  line = line.replace(/#\{([^}]+)}/g, function(block, code, offset){
    // markers[offset] = this.syntax(code);
    // TODO Pass `code` through the compiler
    markers[offset] = code;
    return '#{' + offset + '}';
  }.bind(this));

  line = line.replace(/\s+/g, ''); // Shorten spaces
  line = line.replace(/'/g, "\\'"); // Escape Single Quotes

  // Inject the code blocks
  line = line.replace(/#\{(\d+)}/, function(block, m, offset){
    return '\' + (' + markers[m] + ') + \'';
  }.bind(this));

  return line;
};

module.exports = Regex;
