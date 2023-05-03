import { API, FileInfo } from 'jscodeshift';

/*
- drops any Pixi.property access to directly identifier usage
- imports all these identifiers as symbols of pixi.js
*/

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    const symbols = new Set<string>();

    root.find(j.MemberExpression).forEach(path => {
        //console.log('***', j(path).toSource());

        const object = (path.node.object as any).name;
        
        if (object === 'Pixi') {
            const property = (path.node.property as any).name;
            const identifier = j.identifier( property );

            path.replace(identifier);

            symbols.add(property);
        }
    });

    let child0;
    root.find(j.Statement).forEach((path) => {
        if (!child0) child0 = path;
    });

    const symbols2 = Array.from(symbols);
    symbols2.sort();

    if (symbols2.length > 0) {
        const decl = j.importDeclaration(
            symbols2.map(sym => j.importSpecifier(j.identifier(sym), j.identifier(sym))),
            j.stringLiteral('pixi.js')
        );
    
        j(child0).insertBefore(decl);
    }

    return root.toSource();
}
