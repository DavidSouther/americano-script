// splices: function(line){
//   if (!line.match(/\[[^\]]+\.\.[^\]]+\]/)) { return line; }
//
//   spliceRegex = /\[\s*([^\s]*[^\s\.])\s*(\.{2,3})\s*([^\s\]]+)?\s*\](?:\s+=\s+([^\s]+|\[[^\]]+\]))?/g;
//
//   line = line.replace(spliceRegex, spliceReplacer);
//
//   return line;
//
//   function spliceReplacer(splice, min, type, max, replace, offset) {
//     if ( replace ) {
//       // Splicing something in
//       if ( !max ) {
//         max = '9e9';
//       }
//       return '.splice(' + min + ', ' + max + ' - ' + min + (type == '..' ? ' + 1' : '') + ', ' + replace + ')';
//     } else {
//       // Slicing something off
//       if ( !max ) {
//         return '.slice(' + min + ')';
//       } else if ( type == '...' ){
//         return '.slice(' + min + ', ' + max + ')';
//       } else {
//         return '.slice(' + min + ', +' + max + ' + 1 || 9e9)';
//       }
//     }
//   }
// },
