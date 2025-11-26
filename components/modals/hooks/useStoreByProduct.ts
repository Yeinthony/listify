import { useEffect, useState } from "react"
import { StoreByProductProps } from "../types/store-by-product"
import { getPriceBranchByProduct } from "@/api/products.api"
import { PriceBranchByProduct } from "@/types/products"

export const useStoreByProduct = ({ean, store, isOpen }: StoreByProductProps) => {
  const [data, setData] = useState<PriceBranchByProduct[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const loadData = async() => {
    try {
      setLoading(true)
      const res = await getPriceBranchByProduct({ean, storeId: store?.id || ''})
      console.log('res get StoreByProduct: ', res);
      if(res.status === 200) setData(res.data)
      
    } catch (error) {
      console.log('error get StoreByProduct: ', error);
      
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(store && isOpen) loadData()
  }, [isOpen])
  

  return {
    data,
    loading
  }
}