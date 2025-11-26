import { getProductByEanAll } from "@/api/products.api";
import useSnackbarStore from "@/store/snackbarStore";
import { ProductAll, Store } from "@/types/products";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react"

const bannerImages = [
  {
    url: "https://picsum.photos/id/1026/500/300",
    mini_url: "https://picsum.photos/id/1026/500/300?blur=10",
    alt: "Oferta especial en membresías",
  },
  {
    url: "https://picsum.photos/id/1027/500/300",
    mini_url: "https://picsum.photos/id/1027/500/300?blur=10",
    alt: "Oferta especial en membresías",
  },
  {
    url: "https://picsum.photos/id/1028/500/300",
    mini_url: "https://picsum.photos/id/1028/500/300?blur=10",
    alt: "Reserva tu clase de spinning",
  },
  {
    url: "https://picsum.photos/id/1029/500/300",
    mini_url: "https://picsum.photos/id/1029/500/300?blur=10",
    alt: "Oferta especial en membresías",
  },
  {
    url: "https://picsum.photos/id/1031/500/300",
    mini_url: "https://picsum.photos/id/1031/500/300?blur=10",
    alt: "Oferta especial en membresías",
  }
]

export const useProductDetails = () => {
  const { showSnackbar } = useSnackbarStore()
  const params = useLocalSearchParams();

  const [loading, setloading] = useState<boolean>(true)
  const [showStoreByProductModal, setShowStoreByProductModal] = useState<boolean>(false)
  const [productData, setproductData] = useState<ProductAll | null>(null)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const ean = Array.isArray(params.ean) ? params.ean[0] : params.ean || "";

  const loadProduct = async() => {
    try {
      const res = await getProductByEanAll(ean)
      console.log('product all: ', res);

      if(res.status === 200){
        setproductData(res.data)
      }
      
    } catch (error) {
      console.log('Error al cargar producto: ', error);
    } finally {
      setloading(false)
    }
  }

  useEffect(() => {
    loadProduct()
  }, [])
  

  return {
    bannerImages,
    loading,
    productData,
    showStoreByProductModal,
    selectedStore,
    setShowStoreByProductModal,
    setSelectedStore,
  }
}