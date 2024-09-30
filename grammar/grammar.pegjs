{{
  import * as ast from './AST.js'
}}

Start
  = @Statements* _

Statements
  = @Statement ";"
  / _ "{" _ stmts:Statements* _ "}" { return new ast.Block(stmts); }

Statement
  = _ "echo" _ expr:Expression { return new ast.Echo(expr) }
  / _ "var" _ id:Identifier _ "=" _ expr:Expression { return new ast.NewVar(id, expr); }

Expression
  = head:Term tail:(_ ("+" / "-") _ Term)* {
      return tail.reduce(
        (left, right) => new ast.Binary(left, right[1], right[3]),
        head
      );
    }

Term
  = head:Factor tail:(_ ("*" / "/") _ Factor)* {
      return tail.reduce(
        (left, right) => new ast.Binary(left, right[1], right[3]),
        head
      );
    }

Factor
  = "(" _ @Expression _ ")"
  / Unary
  / Integer
  / id:Identifier { return new ast.VarCall(id); }

Unary
  = _ op:"-" _ expr:Factor { return new ast.Unary(op, expr); }

Integer "integer"
  = _ [0-9]+ { return new ast.Literal(text()); }

Identifier
  = _ [a-z_][a-z0-9_]* { return text(); }

_ "whitespace"
  = [ \t\n\r]*
