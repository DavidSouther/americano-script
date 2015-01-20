function Heredoc(match){
  this.string = match.replace(/"""/g, '').replace('#{', '${');
}
Heredoc.regex = /"""(.|\n)+"""/;
Heredoc.prototype.toCode = function(){
  return '`' + this.string + '`';
}

module.exports = Heredoc;
