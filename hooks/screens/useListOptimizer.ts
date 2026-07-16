import { useMutation } from "@tanstack/react-query";
import { optimizeList } from "@/api/shoppingLists.api";
import { OptimizePayload } from "@/api/types/shopping-lists";
import { DEFAULT_CHANNEL } from "@/assets/globalsConst";
import { requestCurrentCoords } from "@/utils/location";

interface OptimizeOptions {
  km: number;
  maxStores?: number;
}

export const useListOptimizer = (id: string) => {
  const mutation = useMutation({
    mutationFn: (payload: OptimizePayload) => optimizeList(id, payload).then(res => res.data),
  });

  const optimize = async ({ km, maxStores = 1 }: OptimizeOptions) => {
    const result = await requestCurrentCoords();
    if (result.status !== 'granted') return;

    return mutation.mutateAsync({
      lat: result.coords.lat,
      lng: result.coords.lng,
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
