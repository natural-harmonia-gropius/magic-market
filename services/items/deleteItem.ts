import { prisma } from "@/prisma";

export async function deleteItem(id: bigint) {
  return prisma.item.delete({
    where: {
      c2cItemsId: id,
    },
  });
}
