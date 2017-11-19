import { collect, Help, Program } from 'jargs';

collect(
  Help(
    'help',
    {
      alias: 'h',
      description: 'Display help and usage info',
    },
    Program(
      'react-auto-intl'
    )
  )
);
