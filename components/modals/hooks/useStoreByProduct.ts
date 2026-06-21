import { useEffect, useState } from "react"
import { StoreByProductProps } from "../types/store-by-product"
import { getNearbyBranches } from "@/api/products.api"
import { productKeys } from "@/api/queryKeys"
import { DEFAULT_CHANNEL, DISTANCES_FILTER } from "@/assets/globalsConst";
import { useQuery } from "@tanstack/react-query";

export const useStoreByProduct = ({
  ean,
  store,
  isOpen,
  location
}: StoreByProductProps) => {
  const [distance, setDistance] = useState<number>(5)

  const distances = DISTANCES_FILTER

  const storeId = store ? [store.id] : undefined

  const { data = null, isFetching: loading } = useQuery({
    queryKey: productKeys.nearby(ean, {
      lat: location.lat,
      lng: location.lng,
      km: distance,
      channel: DEFAULT_CHANNEL,
      storeId,
    }),
    queryFn: () => getNearbyBranches({
      ean,
      body: { lat: location.lat, lng: location.lng, km: distance, channel: DEFAULT_CHANNEL, ...(storeId && { storeId }) },
    }).then(res => res.data),
    enabled: isOpen && !!store,
  })

  // Reset UI state when modal closes
  useEffect(() => {
    if (!isOpen) setDistance(5)
  }, [isOpen])

  return {
    data,
    loading,
    distance,
    distances,
    setDistance,
  }
}