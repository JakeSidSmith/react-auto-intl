declare module 'acorn/dist/walk' {
  import * as ESTree from 'estree';

  type AncestorCallback = (node: acorn.Token, state: any, ancestors: acorn.Token[]) => any;

  function fullAncestor(node: ESTree.Program, callback: AncestorCallback, base?: any, state?: any): any;
}

