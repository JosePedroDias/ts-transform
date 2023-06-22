import { API, FileInfo, Identifier } from 'jscodeshift';

type Pair = { globalName: string, packageName: string | undefined };

const PAIRS:Pair[] = [
    //{ globalName: 'extras', packageName: undefined },
    { globalName: 'PIXI', packageName: 'pixi.js' },
    { globalName: 'THREE', packageName: 'three' },
];

/*
global to explicit import

- drops any Pixi.property access to directly identifier usage
- imports all these identifiers as symbols of pixi.js
- TODO: generalization not working well (I expected BitmapText to appear as a symbol and it does not)
*/

export default function transformer(file: FileInfo, { j }: API) {
    // hack 
    const source = file.source.replace(/extras\./g, '').replace(/extras/g, '');

    let isDirty = source !== file.source;

    const root = j(source);

    const symbols = new Set<string>();

    for (let { globalName, packageName } of PAIRS ) {
        root.find(j.MemberExpression).forEach(path => {
            //console.log('***', j(path).toSource(), path.node);
            const object = (path.node.object as any).name;
            if (object === globalName) {
                const property = (path.node.property as any).name;
                const identifier = j.identifier( property );
                path.replace(identifier);
                /*packageName &&*/ symbols.add(property);
                isDirty = true;
            }
        });

        root.find(j.TSQualifiedName).forEach(path => {
            //console.log('***', j(path).toSource(), path.node);
            const node = path.node;
            if (j.Identifier.check(node.left)) {
                const nodeLeft = <Identifier>(node.left);
                if (nodeLeft.name === globalName) {
                    if (j.Identifier.check(node.right)) {
                        const nodeRight = <Identifier>(node.right);
                        /*packageName &&*/ symbols.add(nodeRight.name);
                    }
                    path.replace(node.right);
                    isDirty = true;
                }
            }
        });

        const symbols2 = Array.from(symbols);
        symbols2.sort();

        if (symbols2.length > 0) {
            const decl = j.importDeclaration(
                symbols2.map(sym => j.importSpecifier(j.identifier(sym), j.identifier(sym))),
                j.stringLiteral(packageName)
            );
        
            root.get().node.program.body.unshift(decl);
        }
    }

    return isDirty ? root.toSource() : file.source;
}
