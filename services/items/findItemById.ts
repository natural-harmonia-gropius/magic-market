import { prisma } from "@/prisma";
import { serializeItem } from "./utils";

export async function findItemById(id: bigint) {
  const item = await prisma.item.findUnique({
    where: {
      c2cItemsId: id,
    },
    include: {
      details: {
        include: {
          Detail: true,
        },
      },
    },
  });

  if (!item) return null;

  return serializeItem(item);
}
