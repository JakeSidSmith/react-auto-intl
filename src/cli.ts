#!/usr/bin/env node

import { collect, Help, Program } from 'jargs';

const PROGRAM_NAME = 'react-auto-intl';

collect(
  Help(
    'help',
    {
      alias: 'h',
      description: 'Display help and usage info',
    },
    Program(
      PROGRAM_NAME,
      {
        description: 'Automated internationalization for React applications',
        usage: `${PROGRAM_NAME} [options]`,
        examples: [
          `${PROGRAM_NAME} src/**/*.js`,
        ],
      }
    )
  )
);
