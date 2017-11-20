import * as acorn from 'acorn';
import * as walk from 'acorn/dist/walk';
import { every } from 'lodash';
import { Sources } from './types';

interface StringKeyedObject {
  [i: string]: any;
}

type DeepPartial<T extends {[i: string]: any}> = Partial<{[P in keyof T]: DeepPartial<T[P]>}>;

type Values<T extends {[i: string]: any}> = T[keyof T];
type Keys<T extends {[i: string]: any}> = keyof T;

const ReactCreateElement: DeepPartial<acorn.Node> = {
  type: 'MemberExpression',
  object: {
    type: 'Identifier',
    name: 'React',
  },
  property: {
    type: 'Identifier',
    name: 'createElement',
  },
};

const matchesNode = <T extends acorn.Node | acorn.SubNode>(node: T, match: Partial<T>): boolean => {
  return every(match, (value: Values<T>, key: Keys<T>) => {
    if (typeof value === 'object' && node.hasOwnProperty(key)) {
      return matchesNode<acorn.SubNode>(node[key], value);
    }

    return value === node[key];
  });
};

const traverse = (scope: StringKeyedObject, path: string, source: string) => {
  walk.fullAncestor(acorn.parse(source), (node) => {
    if (matchesNode(node, ReactCreateElement)) {
      console.log(`There's a ${node.type} node at ${node.start}\n\n`, node, '\n\n');
    }
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
