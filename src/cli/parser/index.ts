import { readFile } from 'fs';
import * as glob from 'glob';
import { Tree } from 'jargs';
import * as ts from 'typescript';

const CWD = process.cwd();
const TS_CONFIG = ts.findConfigFile(CWD, ts.sys.fileExists);
const UTF8 = 'utf8';
const DEFAULT_PATTERN = '**/*.@(js|jsx|ts|tsx)';
const GLOB_OPTIONS = {
  absolute: true,
};

const { config: tsconfig, error: tsconfigError } = TS_CONFIG ? ts.readConfigFile(TS_CONFIG, ts.sys.readFile) : {
  config: {
    compilerOptions: {
      target: ts.ScriptTarget.Latest,
    },
  },
  error: undefined,
};

if (tsconfigError) {
  console.error(tsconfigError);
  process.exit(1);
}

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
      ts.createSourceFile(path, source, tsconfig.compilerOptions.target);
    }
  }
};

const traverse = () => {
  console.log('Nope');
};

const parse = (tree: Tree) => {
  const { pattern = DEFAULT_PATTERN } = tree.args;

  getFilePaths(pattern, (paths) => getSources(paths, traverseSources));
};

export default parse;
