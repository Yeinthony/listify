import { getProductByEanAll } from "@/api/products.api";
import { productKeys } from "@/api/queryKeys";
import { DEFAULT_CHANNEL } from "@/assets/globalsConst";
import { Store } from "@/types/products";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react"
import { Loc } from "@/components/modals/types/store-by-product";
import * as Location from 'expo-location';

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
  const params = useLocalSearchParams();

  const [location, setLocation] = useState<Loc>({ lat: 0, lng: 0 });
  const [showStoreByProductModal, setShowStoreByProductModal] = useState<boolean>(false)
  const [showBranchsMapModal, setShowBranchsMapModal] = useState<boolean>(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)

  const ean = Array.isArray(params.ean) ? params.ean[0] : params.ean || "";

  const { data: productData = null, isLoading } = useQuery({
    queryKey: productKeys.detail(ean, { channel: DEFAULT_CHANNEL }),
    queryFn: () => getProductByEanAll(ean).then(res => res.data),
    enabled: !!ean,
  })

  const loading = ean ? isLoading : false

  const getCurrentLocation = async() => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation({ lat: location.coords.latitude, lng: location.coords.longitude });
  }

  useEffect(() => {
    getCurrentLocation()
  }, [])


  const handleSetShowStoreByProductModal = useCallback((value: boolean) => {
    setShowStoreByProductModal(value);
  }, []);

  const handleSetSelectedStore = useCallback((store: Store | null) => {
    setSelectedStore(store);
  }, []);

  return {
    bannerImages,
    loading,
    productData,
    showStoreByProductModal,
    selectedStore,
    location,
    showBranchsMapModal,
    setShowBranchsMapModal,
    setShowStoreByProductModal: handleSetShowStoreByProductModal,
    setSelectedStore: handleSetSelectedStore,
  }
}