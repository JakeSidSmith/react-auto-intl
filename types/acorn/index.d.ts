declare module 'acorn' {

  import * as ESTree from 'estree';

  interface StringKeyedObject {
    [i: string]: any;
  }

  type Token = any;

  interface Options {
    ecmaVersion?: 3 | 5 | 6 | 7 | 8 | 2015 | 2016 | 2017;
    sourceType?: 'script' | 'module';
    onInsertedSemicolon?: (lastTokEnd: number, lastTokEndLoc?: ESTree.Position) => void;
    onTrailingComma?: (lastTokEnd: number, lastTokEndLoc?: ESTree.Position) => void;
    allowReserved?: boolean;
    allowReturnOutsideFunction?: boolean;
    allowImportExportEverywhere?: boolean;
    allowHashBang?: boolean;
    locations?: boolean;
    onToken?: ((token: Token) => any) | Token[];
    onComment?: ((
        isBlock: boolean, text: string, start: number, end: number, startLoc?: ESTree.Position,
        endLoc?: ESTree.Position
    ) => void) | Comment[];
    ranges?: boolean;
    program?: ESTree.Program;
    sourceFile?: string;
    directSourceFile?: string;
    preserveParens?: boolean;
    plugins?: StringKeyedObject;
  }

  class Parser {
    constructor(options: Options, input: string, startPos?: number);

    parse(): ESTree.Program;
  }

  function parse(input: string, options?: Options): ESTree.Program;

  type NodeTypes = 'MemberExpression' | 'Identifier';

  class SubNode {
    type: NodeTypes;
    start: number;
    end: number;
    name: string;
  }

  class Node {
    type: NodeTypes;
    start: number;
    end: number;
    object: SubNode;
    property: SubNode;
    computed: boolean;

    constructor(parser: Parser, pos: number, loc: number);
  }
}
