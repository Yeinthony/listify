import { useMutation } from "@tanstack/react-query";
import { optimizeList } from "@/api/shoppingLists.api";
import { OptimizePayload } from "@/api/types/shopping-lists";
import { DEFAULT_CHANNEL } from "@/assets/globalsConst";

interface OptimizeOptions {
  km: number;
  maxStores?: number;
  lat: number;
  lng: number;
}

export const useListOptimizer = (id: string) => {
  const mutation = useMutation({
    mutationFn: (payload: OptimizePayload) => optimizeList(id, payload).then(res => res.data),
  });

  const optimize = async ({ km, maxStores = 1, lat, lng }: OptimizeOptions) => {
    return mutation.mutateAsync({
      lat,
      lng,
      km,
      maxStores,
      channel: DEFAULT_CHANNEL,
    });
  };

  return {
    optimize,
    result: mutation.data,
    optimizing: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
};
