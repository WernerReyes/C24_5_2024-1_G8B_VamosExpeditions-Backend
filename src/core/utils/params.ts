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
}
