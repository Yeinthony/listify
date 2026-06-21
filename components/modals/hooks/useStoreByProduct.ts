import { useEffect, useState } from "react"
import { StoreByProductProps } from "../types/store-by-product"
import { getNearbyBranches } from "@/api/products.api"
import { NearbyBranch } from "@/types/products"
import { NearbyBranchesProps } from "@/api/types/products";
import { DEFAULT_CHANNEL, DISTANCES_FILTER } from "@/assets/globalsConst";

export const useStoreByProduct = ({ 
  ean, 
  store, 
  isOpen,
  location 
}: StoreByProductProps) => {
  const [data, setData] = useState<NearbyBranch[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [distance, setDistance] = useState<number>(5)

  const distances = DISTANCES_FILTER

  const loadData = async() => {
    try {
      setLoading(true)

      const payload: NearbyBranchesProps = {
        ean,
        body: {
          lat: location.lat,
          lng: location.lng,
          km: distance,
          channel: DEFAULT_CHANNEL,
          ...(store && { storeId: [store.id] })
        }
      }

      const res = await getNearbyBranches(payload)
      console.log('res get StoreByProduct: ', res);
      if(res.status === 200) setData(res.data)
      
    } catch (error) {
      console.log('error get StoreByProduct: ', error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(store && isOpen) {
      loadData()
    }
  }, [isOpen, distance, store?.id])

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setData(null)
      setDistance(5)
    }
  }, [isOpen])

  return {
    data,
    loading,
    distance,
    distances,
    setDistance,
  }
}