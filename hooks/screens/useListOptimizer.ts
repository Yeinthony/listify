import { useMutation } from "@tanstack/react-query";
import * as Location from "expo-location";
import { optimizeList } from "@/api/shoppingLists.api";
import { OptimizePayload } from "@/api/types/shopping-lists";
import { DEFAULT_CHANNEL } from "@/assets/globalsConst";

interface OptimizeOptions {
  km: number;
  maxStores?: number;
}

export const useListOptimizer = (id: string) => {
  const mutation = useMutation({
    mutationFn: (payload: OptimizePayload) => optimizeList(id, payload).then(res => res.data),
  });

  const optimize = async ({ km, maxStores = 1 }: OptimizeOptions) => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;

    const location = await Location.getCurrentPositionAsync({});

    return mutation.mutateAsync({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
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
