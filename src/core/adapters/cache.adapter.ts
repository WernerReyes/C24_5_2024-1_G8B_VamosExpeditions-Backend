import NodeCache from "node-cache";

export class CacheAdapter {
  private cache: NodeCache;

  private static instance: CacheAdapter;

  constructor({
    stdTTL = 60 * 60 * 24, // 1 day
  }) {
    this.cache = new NodeCache({ stdTTL });
  }

  public static getInstance = (): CacheAdapter => {
    if (!CacheAdapter.instance) {
      CacheAdapter.instance = new CacheAdapter({
        stdTTL: 60 * 60 * 24,
      });
    }


    return CacheAdapter.instance;
  };

  public get = <T>(key: string): T => {
    return this.cache.get(key) as T;
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
