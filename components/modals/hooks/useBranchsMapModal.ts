import { useTranslation } from "react-i18next";
import { BranchMapMarker, useBranchsMapModalProps } from "../types/branchs-map";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_CHANNEL, DISTANCES_FILTER } from "@/assets/globalsConst";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { getNearbyBranches } from "@/api/products.api";
import { productKeys } from "@/api/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useOriginLocation } from "./useOriginLocation";
import { regionForKm, zoomInScale, zoomOutScale } from "@/utils/mapRegion";

import MapView from "react-native-maps";
import * as Location from "expo-location";
import helpers from "@/utils/helpers";

const BRANCH_PIN = require('@/assets/images/shopping-area.png');

export const useBranchsMapModal = ({
  isOpen,
  location,
  availableStores,
  ean
}: useBranchsMapModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();

  const [currentLocation, setCurrentLocation] = useState(location);
  const [storesId, setStoresId] = useState<string[]>([]);
  const [selectedStoresName, setSelectedStoresName] = useState<string>("Todos los comercios");
  const [scale, setScale] = useState<number>(1)
  const [distance, setDistance] = useState<number>(2.5)
  const [appliedStoresId, setAppliedStoresId] = useState<string[]>([])

  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const mapRef = useRef<MapView>(null);

  const distances = DISTANCES_FILTER

  const {
    savedLocations,
    selectedId,
    origin,
    originName,
    selectLocation,
    selectMyLocation,
    showAddLocationModal,
    openAddLocation,
    closeAddLocation
  } = useOriginLocation({ isOpen, fallback: currentLocation })

  const { data, isFetching, refetch } = useQuery({
    queryKey: productKeys.nearby(ean, {
      lat: origin.lat,
      lng: origin.lng,
      km: distance,
      channel: DEFAULT_CHANNEL,
      storeId: appliedStoresId.length > 0 ? appliedStoresId : undefined,
    }),
    queryFn: () => getNearbyBranches({
      ean,
      body: {
        lat: origin.lat,
        lng: origin.lng,
        km: distance,
        channel: DEFAULT_CHANNEL,
        ...(appliedStoresId.length > 0 && { storeId: appliedStoresId }),
      },
    }).then(res => res.data.data),
    enabled: isOpen,
  })

  const markersbranches = useMemo<BranchMapMarker[]>(() => {
    if (!data) return []
    return data.map(branch => ({
      id: branch.branch.id,
      coordinate: {
        latitude: branch.branch.latitude,
        longitude: branch.branch.longitude,
      },
      title: `$${branch.price.listPrice} - ${branch.store.name}`,
      description: `${branch.branch.name}, ${branch.branch.province.name} | a ${branch.distanceKm.toFixed(2)} km`,
      image: BRANCH_PIN,
    }))
  }, [data])

  const startLocationTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (newLocation) => {
          console.log('newLocation: ', newLocation);

          const distance = helpers.calculateDistance(
            currentLocation.lat,
            currentLocation.lng,
            newLocation.coords.latitude,
            newLocation.coords.longitude
          );

          console.log('Distancia:', distance, 'metros');

          if (distance >= 200) {
            console.log('Actualizando ubicación - distancia:', distance);
            setCurrentLocation({
              lat: newLocation.coords.latitude,
              lng: newLocation.coords.longitude,
            });
          }
        }
      );
    } catch (error) {
      console.error('Error al rastrear ubicación:', error);
    }
  };

  const zoomOn = () => setScale(zoomInScale)

  const zoomOut = () => setScale(zoomOutScale)

  const centerOnCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      selectMyLocation();

    } catch (error) {
      console.error('Error al obtener ubicación actual:', error);
    }
  };

  const pushStoresId = (storeId: string) => {
    if( storeId === 'all-stores') {
      setStoresId([]);
      return;
    }

    if (storesId[0] === 'all-stores') {
      setStoresId([storeId]);
      return;
    }

    if( storesId.length === 1 && storesId[0] === storeId ) return

    if (storesId.includes(storeId)) {
      setStoresId(storesId.filter(id => id !== storeId));
    } else {
      setStoresId([...storesId, storeId]);
    }
  }

  const changeDistance = (km: number) => {
    setScale(1)
    setDistance(km)
  }

  const handleCloseMenuStore = () => {
    setAppliedStoresId(storesId)
  }

  const region = useMemo(
    () => regionForKm(origin.lat, origin.lng, distance, scale),
    [origin.lat, origin.lng, distance, scale]
  )

  useEffect(() => {
    showSpinnerModal(isFetching)
  }, [isFetching])

  useEffect(() => {
    if (!isOpen) return
    mapRef.current?.animateToRegion(region, 350)
  }, [isOpen, region])

  useEffect(() => {
    if (!isOpen) {
      setDistance(2.5)
      setScale(1)
      setStoresId([]);
      setAppliedStoresId([]);
      return;
    }

    if(!locationSubscription.current) startLocationTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    const selectedStoresText = storesId.length === 0
                                ? 'Todos los comercios'
                                : availableStores
                                  .filter(store => storesId.includes(store.id))
                                  .map(store => store.name)
                                  .join(', ');

    setSelectedStoresName(selectedStoresText);
  }, [storesId])
  

  return {
    t,
    insets,
    origin,
    mapRef,
    region,
    distance,
    distances,
    storesId,
    selectedStoresName,
    markersbranches,
    savedLocations,
    selectedId,
    originName,
    showAddLocationModal,
    pushStoresId,
    setDistance: changeDistance,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
    loadBranchesByLocation: refetch,
    handleCloseMenuStore,
    selectLocation,
    selectMyLocation,
    openAddLocation,
    closeAddLocation
  }
}