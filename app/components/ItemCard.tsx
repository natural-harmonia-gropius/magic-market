import { ApiItem } from "@/types";
import Link from "next/link";
import { ItemCardImage } from "./ItemCardImage";

interface ItemCardProps {
  item: ApiItem;
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link
      href={`https://mall.bilibili.com/neul-next/index.html?page=magic-market_detail&itemsId=${item.c2cItemsId}`}
      className="block group"
    >
      <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden shadow transform hover:-translate-y-1 transition-all duration-300">
        <div className="aspect-square relative">
          <ItemCardImage
            url={item.details[0]?.Detail?.img || ""}
            alt={item.c2cItemsName}
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div className="p-4">
          <h3
            className="text-sm font-bold mb-2 line-clamp-2 h-10 group-hover:text-gray-700 transition-colors duration-200"
            title={item.c2cItemsName}
          >
            {item.c2cItemsName}
          </h3>
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-2">
              <p className="text-gray-900 font-bold">¥{item.showPrice}</p>
              {item.showMarketPrice && (
                <p className="text-gray-400 line-through text-xs">
                  ¥{item.showMarketPrice}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-full">
              <ItemCardImage
                url={item.uface}
                alt={item.uname}
                width={20}
                height={20}
                className="w-5 h-5 rounded-full object-cover"
                loading="lazy"
              />
              <span className="text-xs text-gray-500 truncate max-w-[60px]">
                {item.uname}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
