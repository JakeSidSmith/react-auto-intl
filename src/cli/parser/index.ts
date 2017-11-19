import * as glob from 'glob';
import { Tree } from 'jargs';

const DEFAULT_PATTERN = '**/*.@(js|jsx|ts|tsx)';
const GLOB_OPTIONS = {
  absolute: true,
};

const parse = (tree: Tree) => {
  const { pattern = DEFAULT_PATTERN } = tree.args;

  glob(pattern, GLOB_OPTIONS, (error: Error | null, files: string[]) => {
    console.log(files);
  });
};

export default parse;
