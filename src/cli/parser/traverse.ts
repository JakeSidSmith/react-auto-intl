import * as acorn from 'acorn';
import * as walk from 'acorn/dist/walk';
import { every } from 'lodash';
import { Options } from './types';

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

export const traverse = (options: Options, source: string) => {
  const { main } = options;

  walk.fullAncestor(acorn.parse(source), (node, base, state) => {
    if (matchesNode(node, ReactCreateElement)) {
      // console.log('Base:\n', base, '\nState:\n', state);
      console.log(`There's a ${node.type} node at ${node.start}\n\n`, node, '\n\n');
    }
  });
};
