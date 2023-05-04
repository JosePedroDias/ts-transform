import { API, FileInfo } from 'jscodeshift';

/*
- simplifies package names (drop paths)
- group symbols of the same package and sort them alphabetically
- package names can be renamed according to PACKAGES_TO_RENAME
- symbols import in packages can be renamed according to SYMBOLS_TO_RENAME and have their identifiers corrected
*/

// TODO sort imports [ starting with alpha, @ [ ], . ]
// TODO drop unused symbols?

const PACKAGES_TO_RENAME: { [key: string]: string } = {
    '@arkadium/game-core': '@arkadium/game-core-engine',
    '@arkadium/game-core-plugins': '@arkadium/game-core-plugin-ui',
};

const SYMBOLS_TO_RENAME: { [key: string]: { [key2: string]: string } } = {
    '@arkadium/game-core-engine': {
        Container: 'IOCContainer',
    }
};

function simplifyPackageName(s: string) {
    if (s[0] !== '@') return s;
    let parts = s.split('/');
    if (parts.length > 2) {
        parts = parts.slice(0, 2);
    }
    return parts.join('/');
}

export default function transformer(file: FileInfo, { j }: API) {
    const root = j(file.source);

    const imports = new Map<string, string[]>();

    const identifierRenames = new Map<string, string>();

    root.find(j.ImportDeclaration).forEach((path) => {
        // console.log('*****', j(path).toSource() );
        // console.log(path.node.source.value);
        // path.node.source.value += "x";
        // console.log(path.node.specifiers.map(spec => spec.local.name ));
        // path.node.specifiers.forEach(spec => { spec.local.name += 'z'; });

        if (!path.node.specifiers) return;
        let packageName = simplifyPackageName(path.node.source.value as string);
        const newPackageName = PACKAGES_TO_RENAME[packageName];
        if (newPackageName) {
            packageName = newPackageName;
        }

        const renameBag = SYMBOLS_TO_RENAME[packageName];

        let symbols = path.node.specifiers
        .map(spec => spec.local?.name)
        .map(sym => {
            if (renameBag && sym) {
                const newSym = renameBag[sym];
                if (newSym) {
                    identifierRenames.set(sym, newSym);
                    return newSym;
                }
            }
            return sym;
        })
        .filter(sym => Boolean(sym)) as string[];

        let prevSymbols: string[] | undefined = imports.get(packageName);
        if (prevSymbols) {
            symbols = [...prevSymbols, ...symbols];
        }
        imports.set(packageName, symbols);

        j(path).remove();
    });

    // console.log(imports);

    // add grouped packages with sorted symbols
    const entries = imports.entries();
    for (const [packageName, symbols] of entries) {
        symbols.sort();
        const decl = j.importDeclaration(
            symbols.map(sym => j.importSpecifier(j.identifier(sym), j.identifier(sym))),
            j.stringLiteral(packageName)
        );

        root.get().node.program.body.unshift(decl);
    }

    // make sure to rename identifiers affected by changed symbols
    root.find( j.Identifier ).forEach((path) => {
        const v = path.value.name;
        for (const [oldName, newName] of identifierRenames.entries()) {
            if (v === oldName) {
                path.value.name = newName;
            }
        }
    });
    
    return root.toSource();
}
