import * as ts from 'typescript';

export interface StringKeyedObject {
  [i: string]: any;
}

export type Values<T> = T[keyof T];

export interface Options {
  main: string;
  project: string;
}

export interface ConfigFile {
  config: {
    compilerOptions: Partial<{
      target: string;
      module: string;
    }>;
  };
  error?: ts.Diagnostic;
}
