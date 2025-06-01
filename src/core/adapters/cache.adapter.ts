import { createClient, SetOptions, type RedisClientType } from "redis";
import { EnvsConst } from "../constants";

export class CacheAdapter {
  private static instance: CacheAdapter;
  private cache!: RedisClientType;

  private constructor() {}

  public static async initialize(): Promise<CacheAdapter> {
    if (!CacheAdapter.instance) {
      const adapter = new CacheAdapter();
      await adapter.initializeRedisClient();
      CacheAdapter.instance = adapter;
    }
    return CacheAdapter.instance;
  }

  private async initializeRedisClient(): Promise<void> {
    try {
      const client: RedisClientType = createClient({
        url: EnvsConst.REDIS_URL,
        socket: {
          tls: EnvsConst.NODE_ENV === "production",
          rejectUnauthorized: EnvsConst.NODE_ENV !== "production",
        },
      });

      await client.connect();

      console.log("Redis client connected");
      this.cache = client;
    } catch (error) {
      throw new Error("Failed to initialize Redis client" + error);
    }
  }

  public static getInstance(): CacheAdapter {
    if (!CacheAdapter.instance) {
      throw new Error("CacheAdapter not initialized. Call initialize() first.");
    }

    return CacheAdapter.instance;
  }

  public  clearAll(): void {
    this.cache.flushAll();
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.cache.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  public async set(
    key: string,
    value: any,
    options?: SetOptions
  ): Promise<void> {
    await this.cache.set(key, JSON.stringify(value), options);
  }

  public async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  public async sAdd(key: string, value: any): Promise<void> {
    await this.cache.sAdd(key, JSON.stringify(value));
  }

  public async exists(key: string): Promise<boolean> {
    const exists = await this.cache.exists(key);
    return exists === 1;
  }

  public async hSet(key: string, field: string, value: any): Promise<void> {
    await this.cache.hSet(key, field, JSON.stringify(value));
  }

  public async hDel(key: string, field: string): Promise<void> {
    await this.cache.hDel(key, field);
  }

  public async hGetAll<T>(key: string): Promise<T[]> {
    const data = await this.cache.hGetAll(key);
    return Object.entries(data).map(([key, value]) => JSON.parse(value));
  }

  public async sRem(key: string, value: any): Promise<void> {
    await this.cache.sRem(key, JSON.stringify(value));
  }

  public async sMembers<T>(key: string): Promise<T[]> {
    const data = await this.cache.sMembers(key);
    return data.map((item) => JSON.parse(item));
  }

  public async zAdd(key: string, value: any): Promise<void> {
    await this.cache.zAdd(key, value);
  }
  public async zRange<T>(
    key: string,
    start: number,
    stop: number
  ): Promise<T[]> {
    const data = await this.cache.zRange(key, start, stop);
    return data.map((item) => {
      try {
        return JSON.parse(item);
      } catch (error) {
        return item; //* if parsing fails, return the item as is
      }
    });
  }

  public async zRem(key: string, value: any): Promise<void> {
    await this.cache.zRem(key, value);
  }
}
