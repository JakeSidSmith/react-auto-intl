import helloWorld from '../../src/module';

describe('index.ts', () => {

  it('should export a string as the default', () => {
    expect(helloWorld).toBe('Hello, World!');
  });

});
