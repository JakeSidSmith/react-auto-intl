import { Sources } from './types';

export const traverseSources = (sources: Sources) => {
  const scope = {};

  for (const path in sources) {
    if (sources.hasOwnProperty(path)) {
      const source = sources[path];
    }
  }
};
