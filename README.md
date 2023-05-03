# ts-transform

\*experimental\* Trying to rewrite typescript with typescript. 

I'm well aware ttsc transformers aren't meant to do that...


Uses [simple-ts-transform](https://github.com/slune-org/simple-ts-transform) and [ttypescript](https://github.com/cevek/ttypescript) to change typescript code.

Not ideal as it drops all type definitions and changes whitespace...

## setup

```
npm install
```

## usage

```
npm run build
```

Changes `src` folder into `dist` folder applying transformations defined in `transformers/index.ts`


## transformers

- (demo) MyFileNameInserter
- (demo) NumberToString
- (ok) OnlyRootImports
- (todo) RenameImportedPackages
- (todo ChangeImportSymbols
- (ok) GroupImports


## help

check what TS generates for a set of statements and adapt

https://ts-ast-viewer.com/
