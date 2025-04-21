
const headers = {
  HABITACIONES: ["id", "idhotel", "tipo_habitacion", "tipo_temporada", "precio_dolares", "impuesto_servicio", "tarifa_dolares", "precio_soles"],
  HOTELES: ["idhotel", "categoria", "nombre", "direccion", "id_distrito"],
  DISTRITO: ["nombre", "id", "id_ciudad"],
  CIUDAD: ["name", "id", "country_id"],
  PAIS: ["id", "name", "code"],
};

export class InsertManyHotelExcelDto {

   

  constructor(
    public readonly HABITACIONES?: string[],
    public readonly HOTELES?: string[],
    public readonly DISTRITO?: string[],
    public readonly CIUDAD?: string[],
    public readonly PAIS?: string[]
  ) {}

  private static validateSheetName(
    sheetName: string,
    enumValues: string[]
  ): string | null {
    if (!enumValues.includes(sheetName)) {
      return `La hoja '${sheetName}' no es válida. Las hojas permitidas son: ${enumValues.join(", ")}.`;
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
        return `Faltan las siguientes columnas en la hoja '${sheetName}': ${missingColumns.join(", ")}`;
      }
    }
    return null;
  }




  static create(props: Record<string, { column: string[] }>): [string | undefined, InsertManyHotelExcelDto | undefined] {
    
    for (const sheetName of Object.keys(props)) {
      const error = InsertManyHotelExcelDto.validateSheetName(
        sheetName,
        Object.keys(headers)
      );
      if (error) return [error, undefined];

      const columns = props[sheetName]?.column;
      
      const columnError = InsertManyHotelExcelDto.validateColumns(
        sheetName,
        columns
      );
      if (columnError) return [columnError, undefined];
    }

    
    return [
      undefined,
      new InsertManyHotelExcelDto(
        props.HABITACIONES?.column,
        props.HOTELES?.column,
        props.DISTRITO?.column,
        props.CIUDAD?.column,
        props.PAIS?.column
      ),
    ];
  }
  
}
