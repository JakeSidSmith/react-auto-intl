import * as acorn from 'acorn';
import * as walk from 'acorn/dist/walk';
import { Sources } from './types';

const traverse = (scope: {[i: string]: any}, path: string, source: string) => {
  walk.fullAncestor(acorn.parse(source), (node: acorn.Token) => {
    console.log(`There's a ${node.type} node at ${node.start}`);
  });
};

export const traverseSources = (sources: Sources) => {
  const scope = {};

  for (const path in sources) {
    if (sources.hasOwnProperty(path)) {
      const source = sources[path];

      traverse(scope, path, source);
    }
  }
};
