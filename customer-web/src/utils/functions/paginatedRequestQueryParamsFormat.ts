import { PaginatedRequestParamsType } from "@/src/utils/types/api.type";

export function paginatedRequestQueryParamsFormat(
  params: PaginatedRequestParamsType,
): URLSearchParams {
  const queryParams = new URLSearchParams();
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.search) {
    queryParams.append("search", params.search);
  }
  if (params.sortBy) {
    params.sortBy.forEach((sortCriterion) =>
      queryParams.append("sortBy", sortCriterion),
    );
  }
  if (params.filter) {
    Object.entries(params.filter).forEach(([key, values]) => {
      if (Array.isArray(values)) {
        values.forEach((value) => queryParams.append(`filter.${key}`, value));
      } else {
        queryParams.append(`filter.${key}`, values);
      }
    });
  }
  return queryParams;
}
