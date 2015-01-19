var Walker = require('./walker');

module.exports = new Walker({
  walkLine: function(line){
    // var p = line.tokens;
    // for(var i = p.length - 1; i >= 0; i++){
    //   if(p[i] instanceof )
    // }
  }
});

      // // End-of-expression case
      // if (parts = tokens[i].value.match(/^([^\?\.]+)\?$/)) { // Should be identifier?
      //   if (tokens[i].value.indexOf('.') > -1){
      //     tokens[i].value = '' + parts[1] + ' != null'
      //   } else {
      //     tokens[i].value = 'typeof ' + parts[1] + ' !== "undefined" && ' + parts[1] + ' !== null';
      //   }
      //   continue;
      // }
      //
      //
      //
      // // middle-of-expression
      // if (tokens[i].value.indexOf('?') > -1) {
      //   parts = tokens[i].value.split('?');
      //   var varline = 'var ';
      //   for (var j = 0; j < parts.length - 1; j++) {
      //     varline += '_ref' + j + ', '
      //   }
      //   varline = varline.substr(0, varline.length - 2) + ';';
      //   this.outlines.push(varline);
      //
      //   tokens[i].value = expandTokens(parts);
      //
      //   continue;
      // }
      //
      //
      // function expandTokens(parts, i){
      //   var assign;
      //   i = i || 0;
      //   if(parts.length === 1){
      //     return '_ref' + (i - 1) + parts[0];
      //   } else {
      //     if(i === 0){
      //       assign = '_ref0 = ' + parts[0];
      //     } else {
      //       assign = '_ref' + i + ' = ' + '_ref' + (i-1) + parts[0];
      //     }
      //     return '(' + assign + ') != null ? ' + expandTokens(parts.slice(1), i+1) + ' : void 0';
      //   }
      // }
