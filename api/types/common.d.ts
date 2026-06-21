export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}
