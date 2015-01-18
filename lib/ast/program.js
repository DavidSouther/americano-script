function Program(statements){
  this.statements = statements;
}
Program.prototype.toCode = function(){
  var s = "";
  this.statements.forEach(function(statement){
    s += statement.toCode();
  });
  return s;
};

module.exports = Program;
