function Unknown(match){
  this.char = match;
}
Unknown.regex = /./;
Unknown.prototype.toString = function(){
  return "UKN(" + this.char + ")";
};
Unknown.prototype.toCode = function(){
  return this.char;
}


module.exports = Unknown;
