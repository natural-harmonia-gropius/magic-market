import { Detail, Item, ItemDetail } from "@prisma/client";

export type ItemWithDetails = Item & {
  details: (ItemDetail & {
    Detail: Detail;
  })[];
};

export function serializeItem(item: ItemWithDetails) {
  return {
    ...item,
    c2cItemsId: item.c2cItemsId.toString(),
    details: item.details.map((detail) => ({
      ...detail,
      Detail: {
        ...detail.Detail,
        skuId: detail.Detail.skuId.toString(),
        blindBoxId: detail.Detail.blindBoxId.toString(),
        itemsId: detail.Detail.itemsId.toString(),
      },
    })),
  };
}

type JsonValue =
  | string
  | number
  | boolean
  | null
  | bigint
  | Date
  | { [key: string]: JsonValue }
  | JsonValue[];

// 通用的JSON序列化函数
export function safeJSONStringify(data: JsonValue): string {
  return JSON.stringify(data, (_key: string, value: JsonValue) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
}
