import * as glob from 'glob';
import { Tree } from 'jargs';
import { some } from 'lodash';
import * as ts from 'typescript';

let tsTarget: ts.ScriptTarget;
let tsModule: ts.ModuleKind;

const MATCH_TS_EXTENSION = /\.tsx?$/i;

const CWD = process.cwd();
const DEFAULT_PATTERN = '**/*.@(js|jsx|ts|tsx)';

const GLOB_OPTIONS = {
  absolute: true,
};

const MODULE_MAPPING: {[i: string]: keyof typeof ts.ModuleKind} = {
  none: 'None',
  commonjs: 'CommonJS',
  amd: 'AMD',
  umd: 'UMD',
  system: 'System',
  es2015: 'ES2015',
  esnext: 'ESNext',
};

const SCRIPT_MAPPING: {[i: string]: keyof typeof ts.ScriptTarget} = {
  es3: 'ES3',
  es5: 'ES5',
  es2015: 'ES2015',
  es2016: 'ES2016',
  es2017: 'ES2017',
  esnext: 'ESNext',
  latest: 'Latest',
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

  paths.map((path) => {
    const source = ts.sys.readFile(path);

    if (source) {
      if (MATCH_TS_EXTENSION.test(path)) {
        sources[path] = ts.transpileModule(
          source,
          {
            compilerOptions: {
              module: tsModule,
              target: tsTarget,
            },
          }
        ).outputText;
      } else {
        sources[path] = source;
      }
    }

    if (Object.keys(sources).length === paths.length) {
      callback(sources);
    }

  });
};

const traverseSources = (sources: Sources) => {
  // for (const path in sources) {
  //   if (sources.hasOwnProperty(path)) {
  //     const source = sources[path];
  //   }
  // }
};

// const traverse = () => {
//   // Does nothing yet
// };

const findTsTarget = () => {
  const tsConfigLocation = ts.findConfigFile(CWD, ts.sys.fileExists);

  const {
    config: {
      compilerOptions: {
        target: configTarget = ts.ScriptTarget.Latest,
        module: configModule = ts.ModuleKind.CommonJS,
      },
    },
    error,
  } = tsConfigLocation ?
    ts.readConfigFile(tsConfigLocation, ts.sys.readFile) : ({} as any);

  if (typeof configTarget === 'string' && !(configTarget.toLowerCase() in SCRIPT_MAPPING)) {
    console.error(`Invalid target in tsconfig: ${configTarget}`); // tslint:disable-line:no-console
  }

  if (typeof configModule === 'string' && !(configModule.toLowerCase() in MODULE_MAPPING)) {
    console.error(`Invalid module in tsconfig: ${configModule}`); // tslint:disable-line:no-console
  }

  if (error) {
    console.error(error); // tslint:disable-line:no-console
    process.exit(1);
  } else {
    tsTarget = typeof configTarget === 'string' &&
      ts.ScriptTarget[SCRIPT_MAPPING[configTarget.toLowerCase()]] ||
      ts.ScriptTarget.Latest;

    tsModule = typeof configModule === 'string' &&
      ts.ModuleKind[MODULE_MAPPING[configModule.toLowerCase()]] ||
      ts.ModuleKind.CommonJS;
  }
};

const parse = (tree: Tree) => {
  const { pattern = DEFAULT_PATTERN } = tree.args;

  getFilePaths(pattern, (paths) => {
    if (!paths.length) {
      console.error('No matching files'); // tslint:disable-line:no-console
    } else {
      console.error(`Matching files:\n  ${paths.join('\n  ')}`); // tslint:disable-line:no-console
    }

    if (some(paths, MATCH_TS_EXTENSION)) {
      findTsTarget();
    }

    getSources(paths, traverseSources);
  });
};

export default parse;
