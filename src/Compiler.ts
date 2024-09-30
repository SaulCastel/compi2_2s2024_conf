import Visitor from './Interfaces/Visitor.js';
import * as ast from './AST.js';
import * as op from './Instructions.js';
import { register, sysCall } from './RiscVConsts.js';
import Node from './Interfaces/Node.js';
import SymbolTable from './Context.js';

export default class Compiler implements Visitor<string> {
    private context: SymbolTable;

    constructor() {
        this.context = new SymbolTable();
    }

    compile(program: Node[]) {
        let code = '.text\nmain:\n';
        for (const ast of program) {
            code += ast.accept(this) + '\n';
        }
        code += op.li(register.A7, sysCall.Exit) + '\n';
        code += op.ecall() + '\n';
        return code;
    }

    visitBlock(node: ast.Block): string {
        this.context.newContext();
        const code: string[] = [];
        for (const ast of node.stmts) {
            code.push(ast.accept(this));
        }
        const count = this.context.finishContext();
        code.push(op.addi(register.SP, register.SP, 4 * count));
        return code.join('\n');
    }

    visitNewVar(node: ast.NewVar): string {
        const code: string[] = [];
        this.context.pushVar(node.identifier);
        code.push(node.expr.accept(this));
        code.push(op.push(-4, register.T0));
        return code.join('\n');
    }

    visitVarCall(node: ast.VarCall): string {
        const index = this.context.get(node.identifier);
        if (index < 0) {
            throw Error(`${node.identifier} doesn't exist`);
        }
        return op.lw(register.T0, index * 4, register.SP);
    }

    visitUnary(node: ast.Unary): string {
        const code: string[] = [];
        code.push(node.expr.accept(this));
        switch (node.operator) {
            case '-':
                code.push(op.sub(register.T0, register.ZERO, register.T0));
                break;
        }
        return code.join('\n');
    }

    visitEcho(node: ast.Echo): string {
        const code: string[] = [];
        code.push(node.expr.accept(this));
        code.push(op.mv(register.A0, register.T0));
        code.push(op.li(register.A7, sysCall.PrintInt));
        code.push(op.ecall());
        code.push(op.li(register.A0, 0xa));
        code.push(op.li(register.A7, sysCall.PrintChar));
        code.push(op.ecall());
        return code.join('\n');
    }

    visitLiteral(node: ast.Literal): string {
        return op.li(register.T0, node.value);
    }

    visitBinary(node: ast.Binary): string {
        const code: string[] = [];
        code.push(node.left.accept(this));
        code.push(op.mv(register.T1, register.T0));
        code.push(node.right.accept(this));
        switch (node.operator) {
            case '+':
                code.push(op.add(register.T0, register.T1, register.T0));
                break;
            case '-':
                code.push(op.sub(register.T0, register.T1, register.T0));
                break;
            case '*':
                code.push(op.mul(register.T0, register.T1, register.T0));
                break;
            case '/':
                code.push(op.div(register.T0, register.T1, register.T0));
                break;
        }
        return code.join('\n');
    }
}
