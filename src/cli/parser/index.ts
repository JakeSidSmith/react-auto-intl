import * as fs from 'fs';
import { Tree } from 'jargs';
import * as path from 'path';
import * as ts from 'typescript';
import {
  CWD,
  MATCHES_TS_EXTENSION,
} from './constants';
import { traverse } from './traverse';
import { ConfigFile, Options } from './types';

const getTsConfig = (options: Options): ts.CompilerOptions => {
  const { project } = options;
  const tsConfigPath = ts.findConfigFile(path.join(CWD, project), ts.sys.fileExists);
  const configFile = fs.readFileSync(tsConfigPath, 'utf8');
  const {
    config,
    error,
  } = ts.parseConfigFileTextToJson(path.basename(tsConfigPath), configFile);

  if (error) {
    console.error(error); // tslint:disable-line:no-console
    return process.exit(1);
  }

  return ts.convertCompilerOptionsFromJson(config.compilerOptions, path.dirname(tsConfigPath)).options;
};

const isNonEmptyString = (value: any): value is string => {
  return typeof value === 'string' && Boolean(value);
};

const getSource = (options: Options, callback: (source: string) => void): void => {
  const { main, project } = options;
  const source = ts.sys.readFile(main);

  if (isNonEmptyString(source)) {
    if (MATCHES_TS_EXTENSION.test(main)) {
      const tsConfig: ts.CompilerOptions = getTsConfig(options);
      const program = ts.createProgram([main], tsConfig);

      program.emit(undefined, (fileName: string, data: string) => {
        callback(data);
      });
    } else {
      // Babel compile JS
    }
  } else {
    console.error('Source file is empty.'); // tslint:disable-line:no-console
    return process.exit(1);
  }
};

export const parse = (tree: Tree) => {
  const options = {
    main: path.join(CWD, tree.args.main || ''),
    project: tree.args.project || '',
  };

  getSource(options, (source: string) => {
    traverse(options, source);
  });
};
