import { PrismaClient } from '@prisma/client';
type String<T> = NestedKeys<T>;

type NestedKeys<T, Prefix extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ? T[K] extends Date | null
      ? `${Prefix}${Extract<K, string>}` // no expandir fechas o null
      :
          | `${Prefix}${Extract<K, string>}`
          | NestedKeys<T[K], `${Prefix}${Extract<K, string>}.`>
    : `${Prefix}${Extract<K, string>}`;
}[keyof T];

export abstract class Model<T extends Record<string | number, any>> {
  constructor() {}

  protected abstract get getEmpty(): T;

  protected getString(): String<T>[] {
    return this.getNestedKeys(this.getEmpty) as String<T>[];
  }

  private getNestedKeys(obj: any, prefix = ""): string[] {
    const keys: string[] = [];

    if (Array.isArray(obj)) {
      for (const item of obj) {
        keys.push(...this.getNestedKeys(item, prefix));
      }
    } else {
      for (const key of Object.keys(obj)) {
        const value = obj[key];
        const currentKey = prefix ? `${prefix}.${key}` : key;

        if (
          value !== null &&
          typeof value === "object" &&
          !(value instanceof Date)
        ) {
          keys.push(...this.getNestedKeys(value, currentKey));
        } else {
          if (value !== undefined) {
            keys.push(currentKey);
          }
        }
      }
    }
    return keys;
  }
}

export const prisma = new PrismaClient();