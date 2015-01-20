function Dedent(space, position){
  this.space = space;
  this.depth = this.space.length;
  this.position = position;
}
Dedent.prototype.toString = function(){
  return "DEDENT(" + this.depth + ")";
}

module.exports = Dedent;
