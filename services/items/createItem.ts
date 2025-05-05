import { prisma } from "@/prisma";
import type { ItemCreateInput } from "./types";

export async function createItem(data: ItemCreateInput) {
  // 生成一个新的c2cItemsId
  const maxItem = await prisma.item.findFirst({
    orderBy: {
      c2cItemsId: "desc",
    },
  });
  const c2cItemsId = (maxItem?.c2cItemsId ?? BigInt(0)) + BigInt(1);

  return prisma.item.create({
    data: {
      c2cItemsId,
      c2cItemsName: data.c2cItemsName,
      isMyPublish: data.isMyPublish,
      paymentTime: data.paymentTime,
      price: data.price,
      showMarketPrice: data.showMarketPrice,
      showPrice: data.showPrice,
      totalItemsCount: data.totalItemsCount,
      type: data.type,
      uface: data.uface,
      uid: data.uid,
      uname: data.uname,
      uspaceJumpUrl: data.uspaceJumpUrl,
      details: {
        create: data.details?.map((detail) => ({
          Detail: {
            connect: {
              skuId: detail.skuId,
            },
          },
        })),
      },
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
