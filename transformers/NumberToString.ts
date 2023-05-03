import type { Node, NumericLiteral } from 'typescript';

import type { NodeVisitor } from 'simple-ts-transform';

import type { MyContext } from './MyContext';

import { isNumericLiteral } from 'typescript';

export default class NumberToString implements NodeVisitor<NumericLiteral> {
  public constructor(private readonly context: MyContext) {
  }

  public wants(node: Node): node is NumericLiteral {
    return isNumericLiteral(node);
  }

  public visit(node: NumericLiteral) {
    const { createStringLiteral } = this.context.factory;
    return [
      createStringLiteral(node.getText())
    ];
  }
}
