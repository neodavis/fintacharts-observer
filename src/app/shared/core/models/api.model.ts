export interface DataResponse<DataType = unknown> {
  data: DataType;
}

export interface PaginatedDataResponse<DataType = unknown> extends DataResponse<DataType[]> {
  paging: Paging;
}

export interface PaginationPayload {
  size: number;
  page: number;
}

interface Paging {
  items: number;
  page: number;
  pages: 7;
}
