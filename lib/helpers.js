var NewLine = require('./tokens/newline');
var Whitespace = require('./tokens/whitespace');
var SingleComment = require('./tokens/singlecomment');
var MultiComment = require('./tokens/multicomment');
var Identifier = require('./tokens/identifier');
var Open = require('./tokens/open');
var Close = require('./tokens/close');
var Operator = require('./tokens/operator');
var Regex = require('./tokens/Regex');
var NumberTok = require('./tokens/number');
var StringTok = require('./tokens/string');
var Heredoc = require('./tokens/heredoc');
var Comma = require('./tokens/comma');
var Unknown = require('./tokens/unknown');
var Indent = require('./tokens/indent');
var Dedent = require('./tokens/dedent');

var Tokens = {
  NewLine: NewLine,
  Whitespace: Whitespace,
  SingleComment: SingleComment,
  MultiComment: MultiComment,
  Identifier: Identifier,
  Open: Open,
  Close: Close,
  Operator: Operator,
  Regex: Regex,
  NumberTok: NumberTok,
  StringTok: StringTok,
  Heredoc: Heredoc,
  Comma: Comma,
  Unknown: Unknown,
  Indent: Indent,
  Dedent: Dedent
}

function isToken(t){
  return typeof Tokens[t.constructor] != 'undefined' ? true : false;
}

var Nodes = {
  ArrayNode: require('./ast/array'),
  Statement: require('./ast/statement'),
  // Line: Line,
  // Block: Block
}

function isNode(n){
  return typeof Nodes[n.constructor] != 'undefined' ? true : false;
}

module.exports = {
  Tokens: Tokens,
  isToken: isToken,
  Nodes: Nodes,
  isNode: isNode
}
