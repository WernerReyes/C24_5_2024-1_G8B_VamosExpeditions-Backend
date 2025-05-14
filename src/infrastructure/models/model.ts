import { PrismaClient } from "@prisma/client";
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

  protected abstract get getEmpty(): Readonly<T>;

  protected getString(circularPaths: string[] = []): String<T>[] {
    return this.getNestedKeys(
      this.getEmpty,
      "",
      new WeakSet(),
      // circularPaths
    ) as String<T>[];
  }

  private getNestedKeys(
    obj: any,
    prefix = "",
    visited = new WeakSet()
  ): string[] {
    const keys: string[] = [];

    if (obj !== null && typeof obj === "object") {
      if (visited.has(obj)) {
        console.warn("Ciclo detectado en el objeto:", obj);
        return []; // Previene ciclos
      }

      visited.add(obj);

      if (Array.isArray(obj)) {
        if (obj.length > 0) {
          // el prefijo actual representa el nombre del array (ej. quotation.version_quotation)
          keys.push(...this.getNestedKeys(obj[0], prefix, visited));
        } else {
          keys.push(prefix); // array vacío: solo agrega el nombre
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
            keys.push(...this.getNestedKeys(value, currentKey, visited));
          } else {
            if (value !== undefined) {
              keys.push(currentKey);
            }
          }
        }
      }
    }

    return keys;
  }

  private getNestedKeysWithCircularControl(
  obj: any,
  prefix = "",
  visited = new WeakSet(),
  circularPaths: string[] = [],
  currentDepth = 0
): string[] {
  const keys: string[] = [];

  // Si no es un objeto, lo retornamos
  if (obj === null || typeof obj !== "object") return [prefix];

  const isCircularPath = circularPaths.some(p => {
    const parts = prefix.split(".");
    const patternParts = p.split(".");

    for (let i = 0; i <= parts.length - patternParts.length; i++) {
      const window = parts.slice(i, i + patternParts.length).join(".");
      if (window === p) return true;
    }

    return false;
  });

  //* Calculate the maximum depth for circular paths
  const maxDepth = isCircularPath ? this.calculateMaxDepth(circularPaths) : Infinity;

  if (isCircularPath && currentDepth > maxDepth) {
    console.warn("Se alcanzó el máximo nivel de profundidad para la ruta circular:", prefix);
    return [];
  }

  if (visited.has(obj)) {
    console.warn("Ciclo detectado en el objeto:", obj);
    circularPaths.push(prefix); // Agregamos la ruta circular
    return [];
  }

  visited.add(obj);

  if (Array.isArray(obj)) {
    if (obj.length > 0) {
      keys.push(
        ...this.getNestedKeysWithCircularControl(
          obj[0],
          prefix,
          visited,
          circularPaths,
          currentDepth + 1
        )
      );
    } else {
      keys.push(prefix); //* if empty array, add the prefix
    }
    return keys;
  }

  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const nestedPrefix = prefix ? `${prefix}.${key}` : key;

    //* if the value is undefined, we ignore it
    if (value === undefined) {
      continue;
    }
    //* if the value is an object or array, we traverse it recursivel
    if (value === null || typeof value !== "object") {
      keys.push(nestedPrefix);
    } else {
      keys.push(
        ...this.getNestedKeysWithCircularControl(
          value,
          nestedPrefix,
          visited,
          circularPaths,
          currentDepth + 1
        )
      );
    }
  }

  return keys;
}

// Método para calcular la profundidad máxima de los caminos circulares
private calculateMaxDepth(circularPaths: string[]): number {
  let maxDepth = 0;

  // Calculamos la profundidad de cada camino circular
  circularPaths.forEach((path) => {
    const depth = path.split(".").length + 1;
    maxDepth = Math.max(maxDepth, depth); // Establecemos la mayor profundidad encontrada
  });

  return maxDepth;
}

}

export const prisma = new PrismaClient();
