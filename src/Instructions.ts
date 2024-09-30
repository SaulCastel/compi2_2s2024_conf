// reference: https://projectf.io/posts/riscv-cheat-sheet/

import { register } from './RiscVConsts.js';

/**
 * Copy Register
 *
 * mv rd, rs1 -> rd = rs1
 */
export function mv(rd: register, rs1: register) {
    return `mv ${rd}, ${rs1}`;
}

/**
 * Load Immediate
 *
 * li rd, imm -> rd = imm
 */
export function li(rd: register, imm: number) {
    return `li ${rd}, ${imm}`;
}

/**
 * Load Word
 *
 * lw rd, imm(rs1) -> rd = mem[rs1+imm]
 */
export function lw(rd: register, imm: number, rs1: register) {
    return `lw ${rd}, ${imm}(${rs1})`;
}

/**
 * Store Word
 *
 * sw rs2, imm(rs1) -> mem[rs1+imm] = rs2
 */
export function sw(rs2: register, imm: number, rs1: register) {
    return `sw ${rs2}, ${imm}(${rs1})`;
}

/**
 * Add Immediate
 *
 * addi rd, rs1, imm -> rd = rs1 + imm
 */
export function addi(rd: register, rs1: register, imm: number) {
    return `addi ${rd}, ${rs1}, ${imm}`;
}

/**
 * Add
 *
 * rd, rs1, rs2 -> rd = rs1 + rs2
 */
export function add(rd: register, rs1: register, rs2: register) {
    return `add ${rd}, ${rs1}, ${rs2}`;
}

/**
 * Subtract
 *
 * sub rd, rs1, rs2 -> rd = rs1 - rs2
 */
export function sub(rd: register, rs1: register, rs2: register) {
    return `sub ${rd}, ${rs1}, ${rs2}`;
}

/**
 * Multiply
 *
 * mul rd, rs1, rs2 -> rd = (rs1 * rs2)[31:0]
 */
export function mul(rd: register, rs1: register, rs2: register) {
    return `mul ${rd}, ${rs1}, ${rs2}`;
}

/**
 * Divide
 *
 * div rd, rs1, rs2 -> rd = rs1 / rs2
 */
export function div(rd: register, rs1: register, rs2: register) {
    return `div ${rd}, ${rs1}, ${rs2}`;
}

/**
 * Push to stack
 *
 * addi sp, sp, imm; sw rs1, 0(sp)
 */
export function push(imm: number, rs1: register) {
    const code: string[] = [];
    code.push(addi(register.SP, register.SP, imm));
    code.push(sw(rs1, 0, register.SP));
    return code.join('\n');
}

/**
 * Pop stack
 *
 * lw rd, 0(sp); addi sp, sp, imm;
 */
export function pop(imm: number, rd: register) {
    const code: string[] = [];
    code.push(lw(rd, 0, register.SP));
    code.push(addi(register.SP, register.SP, imm));
    return code.join('\n');
}

export function ecall() {
    return 'ecall';
}
