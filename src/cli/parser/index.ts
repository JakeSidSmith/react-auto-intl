import { readFile } from 'fs';
import * as glob from 'glob';
import { Tree } from 'jargs';
import { some } from 'lodash';
import * as ts from 'typescript';

let tsTarget: number;

const MATCH_TS_EXTENSION = /\.tsx?$/i;
const MATCHES_ES = /^es/i;

const CWD = process.cwd();
const UTF8 = 'utf8';
const DEFAULT_PATTERN = '**/*.@(js|jsx|ts|tsx)';

const GLOB_OPTIONS = {
  absolute: true,
};

interface Sources {[i: string]: string}
type GetFilePathsCallback = (paths: string[]) => void;
type GetSourcesCallback = (sources: Sources) => void;

const getFilePaths = (pattern: string, callback: GetFilePathsCallback) => {
  glob(pattern, GLOB_OPTIONS, (error: Error | null, paths: string[]) => {
    callback(paths);
  });
};

const getSources = (paths: string[], callback: GetSourcesCallback) => {
  const sources: Sources = {};

  paths.map((path) => readFile(path, UTF8, (error: NodeJS.ErrnoException, source: string) => {
    sources[path] = source;

    if (Object.keys(sources).length === paths.length) {
      callback(sources);
    }
  }));
};

const traverseSources = (sources: Sources) => {
  for (const path in sources) {
    if (sources.hasOwnProperty(path)) {
      const source = sources[path];

      // TODO: Continue from here
      ts.createSourceFile(path, source, tsTarget);
    }
  }
};

// const traverse = () => {
//   // Does nothing yet
// };

const parse = (tree: Tree) => {
  const { pattern = DEFAULT_PATTERN } = tree.args;

  getFilePaths(pattern, (paths) => {
    if (some(paths, MATCH_TS_EXTENSION)) {
      const tsconfigLocation = ts.findConfigFile(CWD, ts.sys.fileExists);

      const { config: { compilerOptions: { target = ts.ScriptTarget.Latest } }, error } = tsconfigLocation ?
        ts.readConfigFile(tsconfigLocation, ts.sys.readFile) : ({} as any);

      if (error) {
        console.error(error); // tslint:disable-line:no-console
        process.exit(1);
      } else {
        tsTarget = typeof target === 'string' ?
          ts.ScriptTarget[target.replace(MATCHES_ES, 'ES') as keyof typeof ts.ScriptTarget] :
          ts.ScriptTarget.Latest;
      }
    }
    getSources(paths, traverseSources);
  });
};

export default parse;
