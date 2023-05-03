import type { Node, NumericLiteral } from 'typescript';

import type { NodeVisitor } from 'simple-ts-transform';

import { isNumericLiteral } from 'typescript';

import buildTransformer from 'simple-ts-transform';

import { MyContext } from '../MyContext';

class NumberToString implements NodeVisitor<NumericLiteral> {
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

const transformer = buildTransformer(MyContext, [NumberToString]);
export default transformer;
