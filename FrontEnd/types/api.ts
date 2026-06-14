export interface PagedRequest {
  PageNumber?: number;
  PageSize?: number;
}

export interface PagedResponse<T> {
  PageNumber: number;
  PageSize: number;
  TotalRecords: number;
  Data: T[];
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}
