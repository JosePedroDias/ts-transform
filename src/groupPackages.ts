import { API, FileInfo } from 'jscodeshift';

/*
- simplifies package names (drop paths)
- group symbols of the same package and sort them alphabetically
*/

function simplifyPackageName(s: string) {
    if (s[0] !== '@') return s;
    let parts = s.split('/');
    if (parts.length > 2) {
        parts = parts.slice(0, 2);
    }
    return parts.join('/');
}

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const imports = new Map<string, string[]>();

    root.find(j.ImportDeclaration).forEach((path) => {
        // console.log('*****', j(path).toSource() );
        // console.log(path.node.source.value);
        // path.node.source.value += "x";
        // console.log(path.node.specifiers.map(spec => spec.local.name ));
        // path.node.specifiers.forEach(spec => { spec.local.name += 'z'; });

        const packageName = simplifyPackageName(path.node.source.value as string);
        if (!path.node.specifiers) return;
        let symbols = path.node.specifiers.map(spec => spec.local?.name).filter(sym => Boolean(sym)) as string[];

        let prevSymbols: string[] | undefined = imports.get(packageName);
        if (prevSymbols) {
            symbols = [...prevSymbols, ...symbols];
        }
        imports.set(packageName, symbols);

        j(path).remove();
    });

    // console.log(imports);

    const entries = imports.entries();
    for (const [packageName, symbols] of entries) {
        symbols.sort();
        const decl = j.importDeclaration(
            symbols.map(sym => j.importSpecifier(j.identifier(sym), j.identifier(sym))),
            j.stringLiteral(packageName)
        );

        root.get().node.program.body.unshift(decl);
    }
    
    return root.toSource();
}
