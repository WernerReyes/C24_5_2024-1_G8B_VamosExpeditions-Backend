import NodeCache from "node-cache";

export class CacheAdapter {
  private cache: NodeCache;

  constructor({
    stdTTL = 60 * 60 * 24, // 1 day
  }) {
    this.cache = new NodeCache({
      stdTTL,
    });
  }

  public get = (key: string): any => {
    return this.cache.get(key);
  };

  public set = (key: string, value: any): boolean => {
    return this.cache.set(key, value);
  };

  public del = (key: string): number => {
    return this.cache.del(key);
  };

  public flush = (): void => {
    this.cache.flushAll();
  };
}
