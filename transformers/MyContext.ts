import type { NodeFactory, Program, SourceFile, TransformationContext } from 'typescript'

import type { NodeVisitorContext } from 'simple-ts-transform'

export class MyContext implements NodeVisitorContext {
  public readonly basePath: string;
  public factory!: NodeFactory;
  public fileName!: string;

  public constructor(program: Program, public readonly _configuration: unknown) {
    this.basePath = program.getCompilerOptions().rootDir || program.getCurrentDirectory()
  }
  
  public initNewFile(context: TransformationContext, sourceFile: SourceFile): void {
    this.factory = context.factory;
    this.fileName = sourceFile.fileName;
  }
}
