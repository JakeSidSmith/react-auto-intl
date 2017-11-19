import * as glob from 'glob';
import { Tree } from 'jargs';
import { some } from 'lodash';
import * as ts from 'typescript';
import {
  CWD,
  DEFAULT_PATTERN,
  GLOB_OPTIONS,
  MATCH_TS_EXTENSION,
} from './constants';

let tsConfig: any;

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
        console.log(tsConfig);

        sources[path] = ts.transpileModule(source, tsConfig).outputText;
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
  // console.log(sources);

  // for (const path in sources) {
  //   if (sources.hasOwnProperty(path)) {
  //     const source = sources[path];
  //   }
  // }
};

// const traverse = () => {
//   // Does nothing yet
// };

const findTsConfig = () => {
  const tsConfigLocation = ts.findConfigFile(CWD, ts.sys.fileExists);

  const {
    config,
    config: {
      compilerOptions,
      compilerOptions: {
        target: tsTarget = ts.ScriptTarget.Latest,
        module: tsModule = ts.ModuleKind.CommonJS,
      },
    },
    error,
  } = tsConfigLocation ? ts.readConfigFile(tsConfigLocation, ts.sys.readFile) : ({} as any);

  if (error) {
    console.error(error); // tslint:disable-line:no-console
    process.exit(1);
  } else {
    tsConfig = {
      ...config,
      compilerOptions: {
        ...compilerOptions,
        target: tsTarget,
        module: tsModule,
      },
    };
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
      findTsConfig();
    }

    getSources(paths, traverseSources);
  });
};

export default parse;
