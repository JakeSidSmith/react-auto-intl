export interface Sources {[i: string]: string}

export type GetFilePathsCallback = (paths: string[]) => void;
export type GetSourcesCallback = (sources: Sources) => void;
