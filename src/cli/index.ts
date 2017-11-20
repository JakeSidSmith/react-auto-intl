#!/usr/bin/env node

import { Arg, collect, Help, KWArg, Program, Required } from 'jargs';
import { parse } from './parser';

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
        callback: parse,
      },
      Required(
        Arg(
          'main',
          {
            description: 'Path to main file to parse',
          }
        )
      ),
      KWArg(
        'project',
        {
          alias: 'p',
          description: 'Path to typescript project',
        }
      )
    )
  )
);
