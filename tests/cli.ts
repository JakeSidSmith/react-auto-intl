import * as jargs from 'jargs';

describe('cli.ts', () => {

  it('should collect command line arguments', () => {
    jest.spyOn(jargs, 'collect').mockImplementation(() => null);

    require('../src/cli');

    expect(jargs.collect).toHaveBeenCalled();
  });

});
