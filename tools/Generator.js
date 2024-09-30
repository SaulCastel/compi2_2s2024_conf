// Generar clases para AST
// Este archivo genera las clases necesarias para implementar el patrón visitante con Typescript

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import nodes from './Nodes.js';

const __dirname = import.meta.dirname;
const classesDestination = '../src/AST.ts';
const visitorDestination = '../src/Interfaces/Visitor.ts';

let codeString = `
// Auto-generated
import Node from './Node.js';

export default interface Visitor<T> {

`;
for (const node of Object.keys(nodes)) {
    codeString += `\tvisit${node}(node: Node): T\n`;
}
codeString += `}`;

writeFileSync(path.join(__dirname, visitorDestination), codeString);
console.log('Generated visitor Interface');

codeString = `
// Auto-generated
import Node from './Interfaces/Node.js';
import Visitor from './Interfaces/Visitor.js';
`;
for (const [name, args] of Object.entries(nodes)) {
    const argKeys = Object.keys(args);
    codeString += `
export class ${name} implements Node {
    ${argKeys.map((arg) => `${arg}: ${args[arg]};`).join('\n\t')}

    constructor(${argKeys.map((arg) => `${arg}: ${args[arg]}`).join(', ')}) {
        ${argKeys.map((arg) => `this.${arg} = ${arg};`).join('\n\t\t')}
    }

    accept<T>(visitor: Visitor<T>) {
        return visitor.visit${name}(this);
    }
}
    `;
    console.log(`Generating ${name} node`);
}

writeFileSync(path.join(__dirname, classesDestination), codeString);
console.log('Done!');
