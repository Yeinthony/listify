import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { productKeys } from "@/api/queryKeys";
import { searchProducts } from "@/api/products.api";

const PAGE_SIZE = 20;
const MIN_CHARS = 2;
const DEBOUNCE_MS = 350;

export const useSearchProducts = (term: string) => {
  const [debounced, setDebounced] = useState(term.trim());

  useEffect(() => {
    const id = setTimeout(() => setDebounced(term.trim()), DEBOUNCE_MS);
    return () => clearTimeout(id);
  }, [term]);

  const enabled = debounced.length >= MIN_CHARS;

  const query = useInfiniteQuery({
    queryKey: productKeys.search(debounced),
    queryFn: ({ pageParam }) =>
      searchProducts(debounced, pageParam, PAGE_SIZE).then((res) => res.data),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.pages ? last.meta.page + 1 : undefined,
    enabled,
  });

  const products = query.data?.pages.flatMap((p) => p.data) ?? [];

  return {
    products,
    total: query.data?.pages[0]?.meta.total ?? 0,
    enabled,
    isLoading: query.isLoading && enabled,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    fetchNextPage: query.fetchNextPage,
  };
};
