const headers = {
  HOTELS: ["id_hotel", "name", "category", "address", "distrit_id"],
  ROOMS: [
    "room_type",
    "season_type",
    "price_usd",
    "service_tax",
    "rate_usd",
    "price_pen",
    "hotel_id",
  ],
};

export class InsertManyHotelAndRoomExcelDto {
  constructor(
    public readonly HOTELS: string[],
    public readonly ROOMS: string[]
  ) {}

  private static validateSheetName(
    sheetName: string,
    enumValues: string[]
  ): string | null {
    if (!enumValues.includes(sheetName)) {
      return `La hoja '${sheetName}' no es válida. Las hojas permitidas son: ${enumValues.join(
        ", "
      )}.`;
    }
    return null;
  }

  private static validateColumns(
    sheetName: string,
    columns: string[]
  ): string | null {
    const expectedColumns = headers[sheetName as keyof typeof headers];
    if (expectedColumns) {
      const missingColumns = expectedColumns.filter(
        (col) => !columns.includes(col)
      );
      if (missingColumns.length > 0) {
        return `Faltan las siguientes columnas en la hoja '${sheetName}': ${missingColumns.join(
          ", "
        )}`;
      }
    }
    return null;
  }

  static create(
    props: Record<string, { column: string[] }>
  ): [string | undefined, InsertManyHotelAndRoomExcelDto | undefined] {
    for (const sheetName of Object.keys(props)) {
      const error = InsertManyHotelAndRoomExcelDto.validateSheetName(
        sheetName,
        Object.keys(headers)
      );
      if (error) return [error, undefined];

      const columns = props[sheetName]?.column;

      const columnError = InsertManyHotelAndRoomExcelDto.validateColumns(
        sheetName,
        columns
      );
      if (columnError) return [columnError, undefined];
    }

    return [
      undefined,
      new InsertManyHotelAndRoomExcelDto(
        props.HOTELS?.column,
        props.ROOMS?.column
      ),
    ];
  }
}
