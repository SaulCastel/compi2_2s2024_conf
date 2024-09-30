import Visitor from './Visitor.js';

export default interface Node {
    accept<T>(visitor: Visitor<T>): T;
}
