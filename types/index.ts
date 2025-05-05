import type { Detail, Item } from "@prisma/client";

// API类型定义
export interface ApiItem extends Omit<Item, "c2cItemsId"> {
  c2cItemsId: string; // BigInt被序列化为字符串
  details: Array<{
    Detail: Omit<Detail, "skuId" | "blindBoxId" | "itemsId"> & {
      skuId: string;
      blindBoxId: string;
      itemsId: string;
    };
  }>;
}

// API响应类型
export interface ApiResponse {
  items: ApiItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

// 搜索参数类型
export interface SearchParams {
  query?: string;
  page?: number;
  limit?: number;
  sortBy?: "price" | "updatedAt";
  order?: "asc" | "desc";
}
