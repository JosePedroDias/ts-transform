import type { Node, ImportDeclaration } from 'typescript';

import type { NodeVisitor } from 'simple-ts-transform';

import { isImportDeclaration, SyntaxKind, NamedImports, ImportSpecifier } from 'typescript';

import buildTransformer from 'simple-ts-transform';

import { MyContext } from '../MyContext';

class ChangeImportSymbols implements NodeVisitor<ImportDeclaration> {
  public constructor(private readonly context: MyContext) {
  }

  public wants(node: Node): node is ImportDeclaration {
    return isImportDeclaration(node);
  }

  public visit(node: ImportDeclaration) {

    console.log('moduleSpecifier', node.moduleSpecifier.getText());

    node.importClause?.forEachChild((node2: Node) => {
      if (node2.kind === SyntaxKind.NamedImports) {
        const node3 = node2 as NamedImports;
        for (const el of node3.elements) {
          if (el.kind === SyntaxKind.ImportSpecifier) {
              const el2 = el as ImportSpecifier;

              console.log(el2.name.getText());

              //symbols.push(el2.name.text);
          }
      }
      }
      //console.log(node2.kind, SyntaxKind.NamedImports);
    })

    /*const { createStringLiteral } = this.context.factory;
    return [
      createStringLiteral(node.getText())
    ];*/

    return [node];
  }
}

const transformer = buildTransformer(MyContext, [ChangeImportSymbols]);
export default transformer;
