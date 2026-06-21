import { useQueries } from "@tanstack/react-query";
import { productKeys } from "@/api/queryKeys";
import { getProductByEanLight } from "@/api/products.api";
import { ListItem } from "@/types/shopping-lists";

export const useListItemPrices = (items: ListItem[]) => {
  const results = useQueries({
    queries: items.map((item) => ({
      queryKey: productKeys.light(item.product.ean),
      queryFn: () => getProductByEanLight(item.product.ean).then(res => res.data),
      enabled: !!item.product.ean,
    })),
  });

  const priceByProductId: Record<string, number | null> = {};
  let total = 0;
  let pricedCount = 0;

  items.forEach((item, i) => {
    const avgRaw = results[i]?.data?.stats?.avg;
    const avg = avgRaw != null ? parseFloat(avgRaw) : NaN;

    if (!Number.isNaN(avg)) {
      priceByProductId[item.product.id] = avg;
      total += avg * item.quantity;
      pricedCount += 1;
    } else {
      priceByProductId[item.product.id] = null;
    }
  });

  const loading = results.some((r) => r.isLoading);

  return { priceByProductId, total, pricedCount, loading };
};
