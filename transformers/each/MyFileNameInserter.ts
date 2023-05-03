import type { Node, StringLiteral } from 'typescript';

import type { NodeVisitor } from 'simple-ts-transform';

import { isStringLiteral } from 'typescript';

import buildTransformer from 'simple-ts-transform';

import { MyContext } from '../MyContext';

// (this is the example in the simple-ts-transform's README.md)

class MyFileNameInserter implements NodeVisitor<StringLiteral> {
  private readonly fileName: string;

  public constructor(private readonly context: MyContext) {
    this.fileName = context.fileName;
  }

  public wants(node: Node): node is StringLiteral {
    return isStringLiteral(node);
  }

  public visit(node: StringLiteral) {
    const { createStringLiteral } = this.context.factory;
    return [
      createStringLiteral(this.fileName + ': ' + node.getText().slice(1, -1))
    ];
  }
}

const transformer = buildTransformer(MyContext, [MyFileNameInserter]);
export default transformer;
