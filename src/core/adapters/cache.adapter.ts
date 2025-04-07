import { createClient, type RedisClientType } from "redis";
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
    const client: RedisClientType = createClient({
      url: EnvsConst.REDIS_URL,
      socket: {
        tls: EnvsConst.NODE_ENV === "production",
        rejectUnauthorized: EnvsConst.NODE_ENV !== "production",
      },
    });

    client.on("error", (err) => console.error("Redis Client Error", err));

    await client.connect();

    console.log("Redis client connected");
    this.cache = client;
  }

  public static getInstance(): CacheAdapter {
    if (!CacheAdapter.instance) {
      throw new Error("CacheAdapter not initialized. Call initialize() first.");
    }

    return CacheAdapter.instance;
  }

  public async get<T>(key: string): Promise<T | null> {
    const data = await this.cache.get(key);
    return data ? (JSON.parse(data) as T) : null;
  }

  public async set(key: string, value: any): Promise<void> {
    await this.cache.set(key, JSON.stringify(value));
  }

  public async sAdd(key: string, value: any): Promise<void> {
    await this.cache.sAdd(key, JSON.stringify(value));
  }

  public async sRem(key: string, value: any): Promise<void> {
    await this.cache.sRem(key, JSON.stringify(value));
  }

  public async sMembers<T>(key: string): Promise<T[]> {
    const data = await this.cache.sMembers(key);
    return data.map((item) => JSON.parse(item));
  }
}
