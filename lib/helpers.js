var _tokens;
function Tokens(){
  return _tokens = _tokens || {
    NewLine: require('./tokens/newline'),
    Whitespace: require('./tokens/whitespace'),
    SingleComment: require('./tokens/singlecomment'),
    MultiComment: require('./tokens/multicomment'),
    Regex: require('./tokens/regex'),
    Heredoc: require('./tokens/heredoc'),
    Operator: require('./tokens/operator'),
    Identifier: require('./tokens/identifier'),
    NumberTok: require('./tokens/number'),
    StringTok: require('./tokens/string'),
    Open: require('./tokens/open'),
    Close: require('./tokens/close'),
    Comma: require('./tokens/comma'),
    Indent: require('./tokens/indent'),
    Dedent: require('./tokens/dedent'),
    Unknown: require('./tokens/unknown')
  };
}

var _nodes;
function Nodes(){
  return _nodes = _nodes || {
    Statement: require('./ast/statement'),
    Expression: require('./ast/expression'),
    ArrayNode: require('./ast/array'),
    ObjectNode: require('./ast/object'),
    Callable: require('./ast/callable'),
    Block: require('./ast/block'),
    Token: require('./ast/token')
  }
}

function isToken(t){
  return typeof Tokens()[t.constructor] != 'undefined' ? true : false;
}

function isNode(n){
  return typeof Nodes()[n.constructor] != 'undefined' ? true : false;
}

function isLineBreak(n){
  return n instanceof Tokens().NewLine || n instanceof Tokens().Indent;
}

function toS(_){
  return _.toString();
}

function toC(_){
  return _.toCode();
}

module.exports = {
  Tokens: Tokens,
  Nodes: Nodes,
  isToken: isToken,
  isNode: isNode,
  isLineBreak: isLineBreak,
  toS: toS,
  toC: toC
}
