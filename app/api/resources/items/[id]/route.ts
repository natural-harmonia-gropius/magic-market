import {
  deleteItem,
  findItemById,
  updateItem,
  type ItemUpdateInput,
} from "@/services/items";
import { safeJSONStringify } from "@/services/items/utils";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const item = await findItemById(id);

    if (!item) {
      return NextResponse.json({ error: "物品不存在" }, { status: 404 });
    }

    return new NextResponse(safeJSONStringify(item), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("获取物品详情失败:", error);
    return NextResponse.json({ error: "获取物品详情失败" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    const body = (await request.json()) as ItemUpdateInput;
    const item = await updateItem(id, body);
    return new NextResponse(safeJSONStringify(item), {
      headers: {
        "content-type": "application/json",
      },
    });
  } catch (error: unknown) {
    console.error("更新物品失败:", error);
    return NextResponse.json({ error: "更新物品失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = BigInt(params.id);
    await deleteItem(id);
    return NextResponse.json({ message: "物品删除成功" });
  } catch (error: unknown) {
    console.error("删除物品失败:", error);
    return NextResponse.json({ error: "删除物品失败" }, { status: 500 });
  }
}
