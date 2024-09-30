import { readFileSync } from 'node:fs';
import * as Parser from './grammar.js';
import Compiler from './Compiler.js';
import Node from './Interfaces/Node.js';

const filePath = process.argv[2];
const data = readFileSync(filePath, { encoding: 'utf-8' });
const program: Node[] = Parser.parse(data.trim());

const compiler = new Compiler();
console.log(compiler.compile(program));
