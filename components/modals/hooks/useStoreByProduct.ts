import { useEffect, useState } from "react"
import { StoreByProductProps } from "../types/store-by-product"
import { getNearbyBranches } from "@/api/products.api"
import { NearbyBranch } from "@/types/products"
import * as Location from 'expo-location';
import { NearbyBranchesProps } from "@/api/types/products";

export const useStoreByProduct = ({ean, store, isOpen }: StoreByProductProps) => {
  const [data, setData] = useState<NearbyBranch[] | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [showDistanceList, setShowDistanceList] = useState<boolean>(false);
  const [showLocationList, setShowLocationList] = useState<boolean>(false);
  const [distance, setDistance] = useState<number>(5)

  const getCurrentLocation = async() => {
      
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permiso de geolocalizacion denegado');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log('location: ', location);
    
    setLocation(location);
  }

  const loadData = async() => {
    try {
      setLoading(true)
      await getCurrentLocation()

      const payload: NearbyBranchesProps = {
        ean,
        lat: location?.coords.latitude || 0,
        lng: location?.coords.longitude || 0,
        km: distance,
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
    if(store && isOpen) loadData()
  }, [isOpen])
  

  return {
    data,
    loading,
    showDistanceList,
    showLocationList,
    distance,
    setShowDistanceList,
    setShowLocationList,
    setDistance,
  }
}