import { parse, print, prettyPrint, types, visit, run } from "recast";
import tsParser from "recast/parsers/typescript.js";

//const b = recast.types.builders; // to create new nodes
// console.log(Object.keys(types.namedTypes));

const source = `/* hello
world */
function hi(name: string) { return \`\${name}\`}
// line comment
console.log('x');
(<PIXI.Point>this._goModeScoreText.anchor).set(0.5, 0.5);`;

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
/*const typeExamples = new Map();
visit(ast, {
    visitNode: function(path) {
        const node = path.value;
        const type = node.type;
        const code = print(node).code;

        console.log("\n->", type, '\n', code);
        typeExamples.set(type, code);

        //typeExamples.set(type, node);

        this.traverse(path);
    }
});
console.log(Array.from(typeExamples.keys()));
console.log(typeExamples);*/

const output = print(ast).code;
//const output = prettyPrint(ast, { tabWidth: 2 }).code;
console.log(output);
//console.log(output === source);
