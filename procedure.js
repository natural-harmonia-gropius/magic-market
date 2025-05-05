import terminalLink from "terminal-link";

export async function handleItem(item) {
  const { c2cItemsId, c2cItemsName, price } = item;
  const link = terminalLink(
    `${c2cItemsName}`.trim(),
    `https://mall.bilibili.com/neul-next/index.html?page=magic-market_detail&noTitleBar=1&itemsId=${c2cItemsId}&from=market_index`
  );
  console.log(`¥${(price / 100).toString().padEnd(10, " ")}`, link);
}
