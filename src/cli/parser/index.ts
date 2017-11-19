import * as glob from 'glob';
import { Tree } from 'jargs';

const parse = (tree: Tree) => {
  glob(tree.args.glob as string, (error: Error | null, files: string[]) => {
    console.log(files);
  });
};

export default parse;
