function SingleComment(match){
  this.comment = match.substring(2).trim();
}
SingleComment.regex = {source: '//[^\n]+'};
SingleComment.prototype.toString = function(){
  return "COM(" + this.commen.length + ")"
};
SingleComment.prototype.toCode = function(){
  return "// " + this.comment;
};

module.exports = SingleComment;
