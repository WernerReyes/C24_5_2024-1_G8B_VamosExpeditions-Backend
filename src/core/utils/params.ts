export class ParamsUtils {
  static parseArray<T>(param: string): T[] {
    return param.split(",").map((value) => {
      const parsedValue = value.includes("=") ? value.split("=")[1] : value; // 7,4,5,6

      // Convert to number if T is a number
      return (typeof parsedValue === "string" && !isNaN(Number(parsedValue))
        ? Number(parsedValue)
        : parsedValue) as unknown as T;
    }) as T[];
  }

  static parseDBSelect<T>(select: string[]): T {
    const result: any = {};

    const insertPath = (obj: any, parts: string[]) => {
      const [current, ...rest] = parts;

      if (!obj.select) obj.select = {};
      if (!obj.select[current]) obj.select[current] = {};

      if (rest.length === 0) {
        obj.select[current] = true;
      } else {
        if (obj.select[current] !== true) {
          insertPath(obj.select[current], rest);
        }
      }
    };

    for (const path of select) {
      const parts = path.split(".");
      insertPath(result, parts);
    }

    return result.select as T;
  }
}
