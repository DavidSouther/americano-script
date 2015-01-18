function MultiComment(match){
  this.comment = match;
  var _t = this.comment.split('\n');
  var lines = _t.length;
  var columns = _t[lines-1].length;
  this._advance = {
    lines: lines,
    columns: columns
  };
}
MultiComment.regex = /\/\*[\s\S]*\*\//gm;
MultiComment.prototype.toString = function(){
  return "MCOM(" + this.comment + ")"
};
MultiComment.prototype.skip = function(){
  return this._advance;
};
MultiComment.prototype.toCode = function(){
  return this.coment;
};

module.exports = MultiComment;
