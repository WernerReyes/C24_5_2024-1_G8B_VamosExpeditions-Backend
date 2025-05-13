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
    const selectObject = {} as any;

    for (const field of select) {
      const parts = field.split(".");

      if (parts.length === 1) {
        const [parent] = parts;
        // Campo de primer nivel
        selectObject[parent] = true;
      } else if (parts.length === 2) {
        // Campo anidado (por ejemplo: role.id)
        const [parent, child] = parts;

        if (!selectObject[parent.trim()]) {
          selectObject[parent.trim()] = {
            select: {},
          } as any;
        }

        const parentSelect = selectObject[parent] as {
          select: Record<string, boolean>;
        };

        if (parentSelect.select) {
          parentSelect.select[child] = true;
        }
      } else if (parts.length === 3) {
        // Campo anidado (por ejemplo: role.permissions.id)
        const [parent, child, grandChild] = parts;

        if (!selectObject[parent]) {
          selectObject[parent] = {
            select: {},
          } as any;
        }

        const parentSelect = selectObject[parent] as {
          select: Record<string, boolean>;
        };

        if (!parentSelect.select[child]) {
          parentSelect.select[child] = { select: {} } as any;
        }

        const childSelect =
          typeof parentSelect.select[child] === "object" &&
          parentSelect.select[child] !== null
            ? (parentSelect.select[child] as {
                select: Record<string, boolean>;
              })
            : { select: {} };

        childSelect.select[grandChild] = true;
      }
    }

    return selectObject as T;
  }
}
