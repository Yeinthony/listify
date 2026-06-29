import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import * as Location from "expo-location";
import { shoppingListKeys } from "@/api/queryKeys";
import { getListBranchPrices } from "@/api/shoppingLists.api";
import { BranchChannel } from "@/api/types/shopping-lists";
import { LimitFilter } from "@/assets/globalsConst";

interface Coords {
  lat: number;
  lng: number;
}

export const useListBranchPrices = (
  id: string,
  km: number,
  channel: BranchChannel,
  limit: LimitFilter,
) => {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionDenied(true);
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setCoords({ lat: location.coords.latitude, lng: location.coords.longitude });
    })();
  }, []);

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: shoppingListKeys.branchPrices(id, {
      lat: coords?.lat ?? 0,
      lng: coords?.lng ?? 0,
      km,
      channel,
      limit,
    }),
    queryFn: () =>
      getListBranchPrices(id, {
        lat: coords!.lat,
        lng: coords!.lng,
        km,
        channel,
        ...(limit !== 'all' ? { limit } : {}),
      }).then(res => res.data),
    enabled: !!id && !!coords,
  });

  return {
    coords,
    permissionDenied,
    data,
    branches: data?.branches ?? [],
    totalItems: data?.totalItems ?? 0,
    loading: isLoading || isFetching,
    refetch,
  };
};
