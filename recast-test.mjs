import { parse, print, prettyPrint, types, visit, run } from "recast";
import tsParser from "recast/parsers/typescript.js";

//const b = types.builders; // to create new nodes
const nt = types.namedTypes; // console.log(Object.keys(nt));

const source = `
import { x } from 'p1';
import { y as yAlias } from 'p2';`;

const ast = parse(
    source,
    { // https://github.com/benjamn/recast/blob/master/lib/options.ts
        parser: tsParser,
        // sourceFileName: "source.ts",
        tokens: false,
    }
);
//console.log(ast); // type: File
//console.log(ast.program); // type: Program
//console.log(ast.program.body); // array of nodes

// traverse!
const typeExamples = new Map();
visit(ast, {
    visitNode: function(path) {
        const node = path.value;
        const type = node.type;
        const code = print(node).code;

        console.log("\n->", type, '\n', code);
        //typeExamples.set(type, code);
        if (nt.ImportSpecifier.check(node)) {
            console.log(node);
        }

        //typeExamples.set(type, node);

        this.traverse(path);
    }
});
// console.log(Array.from(typeExamples.keys())); console.log(typeExamples);

const output = print(ast).code;
//const output = prettyPrint(ast, { tabWidth: 2 }).code;
console.log(output);
//console.log(output === source);
