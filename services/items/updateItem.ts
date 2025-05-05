import { prisma } from "@/prisma";
import type { ItemUpdateInput } from "./types";

export async function updateItem(id: bigint, data: ItemUpdateInput) {
  return prisma.item.update({
    where: {
      c2cItemsId: id,
    },
    data: {
      ...(data as Omit<ItemUpdateInput, "details">),
      details: data.details
        ? {
            deleteMany: {},
            create: data.details.map((detail) => ({
              Detail: {
                connect: {
                  skuId: detail.skuId,
                },
              },
            })),
          }
        : undefined,
    },
    include: {
      details: {
        include: {
          Detail: true,
        },
      },
    },
  });
}
