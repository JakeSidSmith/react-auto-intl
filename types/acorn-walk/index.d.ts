declare module 'acorn/dist/walk' {
  import * as acorn from 'acorn';
  import * as ESTree from 'estree';

  type AncestorCallback = (
    node: acorn.Node,
    state: any,
    ancestors: acorn.Node[]
  ) => any;

  function fullAncestor(
    node: ESTree.Program,
    callback: AncestorCallback,
    base?: any,
    state?: any
  ): any;
}
