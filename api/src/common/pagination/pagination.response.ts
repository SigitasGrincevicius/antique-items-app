export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): PaginationResponse<T> {
  const totalPages = limit > 0 ? Math.ceil(total / limit) : 0;

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}
