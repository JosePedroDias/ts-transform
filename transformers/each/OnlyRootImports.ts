import type { Node, ImportDeclaration } from 'typescript';

import type { NodeVisitor } from 'simple-ts-transform';

import { isImportDeclaration, factory } from 'typescript';

import buildTransformer from 'simple-ts-transform';

import { MyContext } from '../MyContext';

class OnlyRootImports implements NodeVisitor<ImportDeclaration> {
  public constructor(private readonly context: MyContext) {
    //console.log('cfg', context._configuration);
  }

  public wants(node: Node): node is ImportDeclaration {
    return isImportDeclaration(node);
  }

  public visit(node: ImportDeclaration) {
    let moduleSpecifier = node.moduleSpecifier.getText();
    moduleSpecifier = moduleSpecifier.substring(1, moduleSpecifier.length - 1); // drop delimiters

    //console.log('moduleSpecifier', moduleSpecifier, typeof moduleSpecifier, moduleSpecifier[0]);
    const parts = moduleSpecifier.split('/');
    //console.log('parts', parts, parts.length);

    if (moduleSpecifier[0] === '@' && parts.length > 2) {
        const moduleSpecifier2 = parts.slice(0, 2).join('/');
        //console.log('TO', moduleSpecifier2);
        return [
            factory.createImportDeclaration(
                undefined, // modifiers,
                node.importClause, // import clause,
                factory.createStringLiteral(moduleSpecifier2), // module specifier
            )
        ];
    }

    //console.log('NOOP');
    return [node];
  }
}

const transformer = buildTransformer(MyContext, [OnlyRootImports]);
export default transformer;
