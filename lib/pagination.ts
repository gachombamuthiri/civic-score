export interface PaginationParams {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
}

export interface PaginationResult {
  startIndex: number;
  endIndex: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function getPaginationInfo(params: PaginationParams): PaginationResult {
  const { currentPage, itemsPerPage, totalItems } = params;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return {
    startIndex,
    endIndex,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

export function paginateArray<T>(items: T[], page: number, itemsPerPage: number): T[] {
  const { startIndex, endIndex } = getPaginationInfo({
    currentPage: page,
    itemsPerPage,
    totalItems: items.length,
  });
  return items.slice(startIndex, endIndex);
}
