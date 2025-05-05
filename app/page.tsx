"use client";

import { ApiItem } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ItemCard } from "./components/ItemCard";
import { Pagination } from "./components/Pagination";

interface ApiResponse {
  items: ApiItem[];
  total: number;
  totalPages: number;
  currentPage: number;
}

export default function Home() {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 24;
  const query = searchParams.get("query") || "";

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (query) {
        params.set("query", query);
      }

      const res = await fetch(`/api/resources/items?${params}`);
      const data = (await res.json()) as ApiResponse;

      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, query]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleSearch = useCallback(
    (searchText: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (searchText) {
        current.set("query", searchText);
      } else {
        current.delete("query");
      }
      current.delete("page"); // 重置页码
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${window.location.pathname}${query}`);
    },
    [searchParams, router]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      current.set("page", page.toString());
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${window.location.pathname}${query}`);
    },
    [searchParams, router]
  );

  return (
    <div className="min-h-screen">
      <div className="fixed inset-0 bg-gradient-to-br from-violet-100 via-white to-cyan-100 bg-fixed -z-10" />
      <main className="relative">
        <div className="container mx-auto px-4 py-8">
          <div className="relative mb-8">
            <input
              type="text"
              placeholder="搜索商品..."
              className="w-full px-6 py-4 bg-white/70 backdrop-blur-lg rounded-2xl shadow border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-violet-500/30 transition-all duration-300"
              defaultValue={query}
              onChange={(e) => {
                const value = e.target.value.trim();
                if (!value) {
                  handleSearch("");
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch(e.currentTarget.value.trim());
                }
              }}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="animate-spin h-12 w-12 border-4 border-violet-500 rounded-full border-t-transparent" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {items.map((item) => (
                  <ItemCard key={item.c2cItemsId} item={item} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="mt-12">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
              {items.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-gray-500">
                  <svg
                    className="w-16 h-16 mb-4 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  <p className="text-lg font-medium">没有找到相关商品</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
