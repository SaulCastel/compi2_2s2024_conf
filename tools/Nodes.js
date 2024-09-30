const nodes = {
    Binary: {
        left: 'Node',
        operator: 'string',
        right: 'Node',
    },
    Literal: {
        value: 'any',
    },
    Echo: {
        expr: 'Node',
    },
    VarCall: {
        identifier: 'string',
    },
    Unary: {
        operator: 'string',
        expr: 'Node',
    },
    NewVar: {
        identifier: 'string',
        expr: 'Node',
    },
    Block: {
        stmts: 'Node[]',
    },
};

export default nodes;
