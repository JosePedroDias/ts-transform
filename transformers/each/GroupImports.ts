import type { Node, ImportDeclaration } from 'typescript';

import type { NodeVisitor } from 'simple-ts-transform';

import { isImportDeclaration, SyntaxKind, NamedImports, ImportSpecifier, factory } from 'typescript';

import buildTransformer from 'simple-ts-transform';

import { MyContext } from '../MyContext';


class GroupImports implements NodeVisitor<ImportDeclaration> {
  private imports: Map<string, string[]> = new Map();

  public constructor(private readonly context: MyContext) {
    // console.log('ctor', this.context.fileName);
  }

  public wants(node: Node): node is ImportDeclaration {
    return isImportDeclaration(node);
  }

  public visit(node: ImportDeclaration) {
    let moduleSpecifier = node.moduleSpecifier.getText();
    moduleSpecifier = moduleSpecifier.substring(1, moduleSpecifier.length - 1); // drop delimiters
    // console.log('moduleSpecifier', moduleSpecifier);

    let symbols: string[] = [];

    node.importClause?.forEachChild((node2: Node) => {
      if (node2.kind === SyntaxKind.NamedImports) {
        const node3 = node2 as NamedImports;
        for (const el of node3.elements) {
          if (el.kind === SyntaxKind.ImportSpecifier) {
              const el2 = el as ImportSpecifier;
              symbols.push(el2.name.getText())
          }
        }
      }
    });

    if (symbols.length > 0) {
      let val = this.imports.get(moduleSpecifier);
      if (val) {
        symbols = [...val, ...symbols];
      }
      this.imports.set(moduleSpecifier, symbols);

      //console.log(this.imports);
    }

    let lastNodeOfThese: any = undefined;
    node.parent.forEachChild(node => {
      if (node.kind === SyntaxKind.ImportDeclaration) {
        lastNodeOfThese = node;
      }
    });

    const isLastImport = lastNodeOfThese === node;
    //console.log('isLastImport', isLastImport);

    if (isLastImport) {
      const entries = Array.from(this.imports.entries());
      
      // TODO sort?

      //console.log('entries', entries);
      const result: any[] = [];
      for (const [moduleSpecifier, symbols] of entries) {
        result.push( factory.createImportDeclaration(
          undefined,
          factory.createImportClause(
            false,
            undefined,
            factory.createNamedImports(symbols.map((symbol) => {
              return factory.createImportSpecifier(
                false,
                undefined,
                factory.createIdentifier(symbol)
              );
            }))
          ),
          factory.createStringLiteral(moduleSpecifier),
          undefined
        ) );
      }
      return result;
    } else {
      return []; // record data but drop this statement
    }
  }
}

const transformer = buildTransformer(MyContext, [GroupImports]);
export default transformer;
