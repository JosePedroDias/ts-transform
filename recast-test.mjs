import { parse, print, prettyPrint, types, visit, run } from "recast";
import tsParser from "recast/parsers/typescript.js";

//const b = recast.types.builders; // to create new nodes

// console.log(Object.keys(types.namedTypes));

//const source = `function hi(name) { return \`\${name}\`}`;
// const source = `/* hello
// world */
// function hi(name: string) { return \`\${name}\`}
// // line comment
// console.log('x')`;
const source = `(<PIXI.Point>this._goModeScoreText.anchor).set(0.5, 0.5)`;

// console.log(print(parse(source)).code);

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

//ast.program.body

// traverse!
const typeExamples = new Map();
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
console.log(typeExamples);

//const output = print(ast).code;
//const output = prettyPrint(ast, { tabWidth: 2 }).code;
//console.log(output);

//console.log(print(parse(source)).code);
