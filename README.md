# ts-transform

## setup

```
npm install
```

## usage

```
npm run build
npm run codemod-test -- -t dist/groupPackages.js example-src/*
npm run codemod -- -t dist/all.js example-src/*
npm run codemod -- -t dist/all.js ~/Work/proj/src/**/*.ts ~/Work/proj/build_configurations/**/*.ts

# auxiliary: use this to check how the ts parser parses example code (which types and their structure)
node recast-test.mjs
```

## auxiliary resources

- https://rajasegar.github.io/ast-finder/ (to get find queries)
- https://astexplorer.net (parser: typescript-eslint/parser ?) (to see the AST generated from code)

- https://www.codeshiftcommunity.com/
    - https://www.codeshiftcommunity.com/docs/your-first-codemod
    - https://www.codeshiftcommunity.com/docs/import-manipulation
    - https://www.codeshiftcommunity.com/docs/typescript
    - https://www.codeshiftcommunity.com/docs/prompting-for-human-input
- https://github.com/sejoker/awesome-jscodeshift
- https://www.toptal.com/javascript/write-code-to-rewrite-your-code
- https://github.com/facebook/jscodeshift
- https://github.com/benjamn/recast
- https://github.com/mainmatter/ast-workshop/blob/master/README.md

## some notes

- `commentBlock` and `commentLine` exist in optional `.comments` array of other nodes, not as dedicated nodes. this poses no problem for editing existing nodes, but if you want to remove nodes and keep the nearby comments, you should append then to the previous or next node.
comments are tagged with either `leading` or `trailing` boolean attributes.
- use `root.find(j.Node)` to visit all nodes is jscodeshift
- to check types of nodes found in jscodeshift (my recast-test.mjs also allows checking that)

```ts
const types = new Set<string>();
root.find(j.Node).forEach(path => types.add(path.node.type));
const types2 = Array.from(types); types2.sort();
console.log(types2);
```

- whitespace lines are not stored in the AST. keeping them would require wrapping those as something else around transformations