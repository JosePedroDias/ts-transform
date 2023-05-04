# ts-transform

## setup

```
npm install
```

## usage

```
npm run build
npm run codemod-test -- -t dist/groupPackages.js example-src/*
npm run codemod      -- -t dist/all.js example-src/*
```

## auxiliary resources

- https://rajasegar.github.io/ast-finder/
- https://www.codeshiftcommunity.com/
    - https://www.codeshiftcommunity.com/docs/your-first-codemod
    - https://www.codeshiftcommunity.com/docs/import-manipulation
    - https://www.codeshiftcommunity.com/docs/typescript
    - https://www.codeshiftcommunity.com/docs/prompting-for-human-input
- https://github.com/sejoker/awesome-jscodeshift
- commentBlock and commentLine exist in comments of other nodes
