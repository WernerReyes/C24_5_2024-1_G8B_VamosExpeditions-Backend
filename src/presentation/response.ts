export class ApiResponse<T> {


  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly data: T,
    public readonly headers?: Record<string, string>
  ) {}

  /* static fileResponse(
    buffer: Buffer,
    filename: string,
    message: string = "File download"
  ) {
    return new ApiResponse<Buffer>(200, message, buffer, {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename=${filename}`,
    });
  } */
}

export class PaginatedResponse<T> {
  constructor(
    public readonly content: T[],
    public readonly page: number,
    public readonly totalPages: number,
    public readonly total: number,
    public readonly limit: number
  ) {}
}
