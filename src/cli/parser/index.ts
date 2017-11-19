import * as glob from 'glob';
import { Tree } from 'jargs';

const DEFAULT_PATTERN = '**/*.@(js|jsx|ts|tsx)';

const parse = (tree: Tree) => {
  const { pattern = DEFAULT_PATTERN } = tree.args;

  glob(pattern, (error: Error | null, files: string[]) => {
    console.log(files);
  });
};

export default parse;
