export class ApiResponse<T> {
  constructor(
    public readonly status: number,
    public readonly message: string,
    public readonly data: T
  ) {}
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
