import * as ts from 'typescript';

export const MATCH_TS_EXTENSION = /\.tsx?$/i;

export const CWD = process.cwd();
export const DEFAULT_PATTERN = '**/*.@(js|jsx|ts|tsx)';

export const GLOB_OPTIONS = {
  absolute: true,
};
