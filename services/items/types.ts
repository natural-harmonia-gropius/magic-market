import { Item } from "@prisma/client";

export interface ItemDetailInput {
  skuId: bigint;
}

export type ItemCreateInput = Omit<Item, "c2cItemsId"> & {
  details?: ItemDetailInput[];
};

export type ItemUpdateInput = Partial<ItemCreateInput>;
