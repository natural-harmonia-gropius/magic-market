import type { Detail, Item } from "@prisma/client";
import { prisma } from "../prisma";

// 仅用于接收API数据的类型
type DetailDto = Omit<Detail, "items">;
type ItemDto = Omit<Item, "details"> & {
  detailDtoList: DetailDto[];
};

export async function handleItem(item: ItemDto) {
  try {
    // 创建或更新物品
    const savedItem = await prisma.item.upsert({
      where: { c2cItemsId: item.c2cItemsId },
      create: {
        c2cItemsId: item.c2cItemsId,
        type: item.type,
        c2cItemsName: item.c2cItemsName,
        totalItemsCount: item.totalItemsCount,
        price: item.price,
        showPrice: item.showPrice,
        showMarketPrice: item.showMarketPrice,
        uid: item.uid,
        paymentTime: item.paymentTime,
        isMyPublish: item.isMyPublish,
        uname: item.uname,
        uface: item.uface,
        uspaceJumpUrl: item.uspaceJumpUrl,
      },
      update: {
        type: item.type,
        c2cItemsName: item.c2cItemsName,
        totalItemsCount: item.totalItemsCount,
        price: item.price,
        showPrice: item.showPrice,
        showMarketPrice: item.showMarketPrice,
        uid: item.uid,
        paymentTime: item.paymentTime,
        isMyPublish: item.isMyPublish,
        uname: item.uname,
        uface: item.uface,
        uspaceJumpUrl: item.uspaceJumpUrl,
      },
    });

    // 删除旧的详情关联
    await prisma.itemDetail.deleteMany({
      where: {
        c2cItemsId: savedItem.c2cItemsId,
      },
    });

    // 创建或更新详情以及关联关系
    await Promise.all(
      item.detailDtoList.map(async (detail) => {
        // 创建或更新详情
        const savedDetail = await prisma.detail.upsert({
          where: { skuId: detail.skuId },
          create: {
            skuId: detail.skuId,
            blindBoxId: detail.blindBoxId,
            itemsId: detail.itemsId,
            name: detail.name,
            img: detail.img,
            marketPrice: detail.marketPrice,
            type: detail.type,
            isHidden: detail.isHidden,
          },
          update: {
            blindBoxId: detail.blindBoxId,
            itemsId: detail.itemsId,
            name: detail.name,
            img: detail.img,
            marketPrice: detail.marketPrice,
            type: detail.type,
            isHidden: detail.isHidden,
          },
        });

        // 创建新的关联关系
        await prisma.itemDetail.create({
          data: {
            c2cItemsId: savedItem.c2cItemsId,
            skuId: savedDetail.skuId,
          },
        });
      })
    );

    return savedItem;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      console.log(`Item ${item.c2cItemsId} already exists, skipping...`);
    } else {
      console.error("Error saving item:", error);
      throw error;
    }
  }
}
