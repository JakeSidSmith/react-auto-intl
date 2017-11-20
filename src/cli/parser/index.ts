import { Tree } from 'jargs';
import { join as joinPath } from 'path';
import * as ts from 'typescript';
import {
  CWD,
  MATCHES_TS_EXTENSION,
} from './constants';
import { traverse } from './traverse';
import { Options } from './types';

const getTsConfig = (options: Options): ts.TranspileOptions => {
  const { project } = options;
  const tsConfigLocation = ts.findConfigFile(joinPath(CWD, project), ts.sys.fileExists);

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
  } = tsConfigLocation ?
    ts.readConfigFile(tsConfigLocation, ts.sys.readFile) :
    ({} as {config: ts.TranspileOptions});

  if (error) {
    console.error(error); // tslint:disable-line:no-console
    return process.exit(1);
  }

  return {
    ...config,
    compilerOptions: {
      ...compilerOptions,
      target: tsTarget,
      module: tsModule,
    },
  };
};

const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && Boolean(value);
};

const getSource = (options: Options): string => {
  const { path, project } = options;
  const source = ts.sys.readFile(path);

  if (isNonEmptyString(source)) {
    if (MATCHES_TS_EXTENSION.test(path)) {
      const tsConfig: ts.TranspileOptions = getTsConfig(options);
      return ts.transpileModule(source, tsConfig).outputText;
    }

    return source;
  }

  console.error('Source file is empty.'); // tslint:disable-line:no-console
  return process.exit(1);
};

export const parse = (tree: Tree) => {
  const options = {
    path: joinPath(CWD, tree.args.main || ''),
    project: tree.args.project || '',
  };

  traverse(options, getSource(options));
};
