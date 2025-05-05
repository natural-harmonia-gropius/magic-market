import { prisma } from "@/prisma";
import { type ItemWithDetails, serializeItem } from "./utils";

interface FindAllItemsOptions {
  query?: string;
  page?: number;
  limit?: number;
}

export async function findAllItems(options: FindAllItemsOptions = {}) {
  const { query, page = 1, limit = 24 } = options;

  // 构建查询条件
  const where = query
    ? {
        c2cItemsName: {
          contains: query,
        },
      }
    : {};

  // 获取总数
  const total = await prisma.item.count({ where });

  // 获取分页数据
  const items = await prisma.item.findMany({
    where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      details: {
        include: {
          Detail: true,
        },
      },
    },
  });

  // 序列化数据
  const serializedItems = items.map((item) =>
    serializeItem(item as ItemWithDetails)
  );

  return {
    items: serializedItems,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
  };
}
