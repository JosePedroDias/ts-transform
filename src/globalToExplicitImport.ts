import { API, FileInfo } from 'jscodeshift';

const GLOBAL_NAME = 'PIXI';
const PACKAGE_NAME = 'pixi.js';

/*
global to explicit import

- drops any Pixi.property access to directly identifier usage
- imports all these identifiers as symbols of pixi.js
*/

export default function transformer(file: FileInfo, api: API) {
    const j = api.jscodeshift;
    const root = j(file.source);

    let isDirty = false;

    const symbols = new Set<string>();

    root.find(j.MemberExpression).forEach(path => {
        //console.log('***', j(path).toSource());

        const object = (path.node.object as any).name;
        
        if (object === GLOBAL_NAME) {
            const property = (path.node.property as any).name;
            const identifier = j.identifier( property );

            path.replace(identifier);

            symbols.add(property);
            isDirty = true;
        }
    });

    const symbols2 = Array.from(symbols);
    symbols2.sort();

    if (symbols2.length > 0) {
        const decl = j.importDeclaration(
            symbols2.map(sym => j.importSpecifier(j.identifier(sym), j.identifier(sym))),
            j.stringLiteral(PACKAGE_NAME)
        );
    
        root.get().node.program.body.unshift(decl);
    }

    return isDirty ? root.toSource() : file.source;
}