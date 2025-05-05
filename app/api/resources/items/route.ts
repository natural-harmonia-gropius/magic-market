import {
  createItem,
  findAllItems,
  type ItemCreateInput,
} from "@/services/items";
import { safeJSONStringify } from "@/services/items/utils";
import { NextResponse } from "next/server";

// GET /api/resources/items - 获取所有物品
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query") || undefined;
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 24;

    const result = await findAllItems({
      query,
      page,
      limit,
    });

    // 使用安全的JSON序列化
    return new NextResponse(safeJSONStringify(result), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("获取物品列表失败:", error);
    return NextResponse.json({ error: "获取物品列表失败" }, { status: 500 });
  }
}

// POST /api/resources/items - 创建新物品
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ItemCreateInput;
    const item = await createItem(body);
    // 使用安全的JSON序列化
    return new NextResponse(safeJSONStringify(item), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("创建物品失败:", error);
    return NextResponse.json({ error: "创建物品失败" }, { status: 500 });
  }
}
