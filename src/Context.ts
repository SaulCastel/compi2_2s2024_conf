type TableEntry = {
    id: string;
    depth: number;
};

export default class SymbolTable {
    private depth: number;
    private table: TableEntry[];

    constructor() {
        this.table = [];
        this.depth = 0;
    }

    /**
     * Returns the index for the first match of 'id' in the table
     * @param id the id to match
     * @returns the index for the match
     */

    newContext() {
        this.depth++;
    }

    /**
     * Finishes a context
     * @returns Number of elements removed
     */
    finishContext() {
        let count = 0;
        for (let index = this.table.length - 1; index >= 0; index--) {
            if (this.table[index].depth < this.depth) break;
            count++;
            this.table.pop();
        }
        this.depth--;
        return count;
    }

    get(id: string) {
        for (let index = this.table.length - 1; index >= 0; index--) {
            if (id === this.table[index].id) {
                const position = this.table.length - 1 - index;
                // console.log(this.table);
                // console.log(`${id}: ${position}`);
                return position;
            }
        }
        return -1;
    }

    pushVar(id: string) {
        for (let index = this.table.length - 1; index >= 0; index--) {
            if (this.table[index].depth < this.depth) break;
            if (this.table[index].id === id) {
                throw Error(`${id} already exists in this context`);
            }
        }
        this.table.push({
            id,
            depth: this.depth,
        });
    }
}
