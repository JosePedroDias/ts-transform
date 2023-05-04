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

- https://rajasegar.github.io/ast-finder/
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

- `commentBlock` and `commentLine` exist in optional `.comments` array of other nodes, not as dedicated nodes
- use `root.find(j.Node)` to visit all nodes is jscodeshift
- to check types of nodes found in jscodeshift

```ts
const types = new Set<string>();
root.find(j.Node).forEach(path => types.add(path.node.type));
const types2 = Array.from(types); types2.sort();
console.log(types2);
```
