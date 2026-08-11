export type PaginatedResponseType<T> = {
  data: T[];
  meta: {
    itemsPerPage: number;
    totalItems: number;
    currentPage: number;
    totalPages: number;
    sortBy: [string, string][];
  };
};

export type PaginatedRequestParamsType = {
  page?: number;
  limit?: number;
  filter?: Record<string, string[] | string>;
  sortBy?: string[];
  search?: string;
};
