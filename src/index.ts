import { readFileSync } from 'node:fs';
import * as Parser from './grammar.js';

const filePath = process.argv[2];
const data = readFileSync(filePath, { encoding: 'utf-8' });

console.log(Parser.parse(data.trim()));
