import { useTranslation } from "react-i18next";
import { BranchMapMarker, useBranchsMapModalProps } from "../types/branchs-map"; 
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { DISTANCES_FILTER } from "@/assets/globalsConst";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { getNearbyBranches } from "@/api/products.api";

import * as Location from "expo-location";
import helpers from "@/utils/helpers";
import { useImage } from "expo-image";

export const useBranchsMapModal = ({ 
  isOpen, 
  location, 
  availableStores, 
  ean 
}: useBranchsMapModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();
  const image = useImage(require('@/assets/images/shopping-area.png'), {
    onError(error) {
      console.error('Loading failed:', error.message);
    }
  });

  const [currentLocation, setCurrentLocation] = useState(location);
  const [locationSelected, setLocationSelected] = useState(location);
  const [storesId, setStoresId] = useState<string[]>([]);
  const [selectedStoresName, setSelectedStoresName] = useState<string>("Todos los comercios");
  const [zoom, setZoom] = useState<number>(12)
  const [distance, setDistance] = useState<number>(2.5)
  const [markersbranches, setMarkersBranches] = useState<BranchMapMarker[]>([])

  const prevStoresId = useRef<string[]>([])
  
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  const distances = DISTANCES_FILTER

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

  const zoomOn = () => {
    if (zoom < 21) setZoom(zoom + 1);
  }

  const zoomOut = () => {
    if (zoom > 1) setZoom(zoom - 1);
  }

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

  const loadBranchesByLocation = async() => {
    try {
      showSpinnerModal(true);

      const payload = {
        ean,
        body: {
          lat: location.lat,
          lng: location.lng,
          km: distance,
          channel: 'minorista',
          ...(storesId.length > 0 && { storeId: storesId })
        }
      }

      const res = await getNearbyBranches(payload)
      console.log('res loadBranchesByLocation: ', res);
      if(res.status === 200) {
        const marksBranches = res.data.map(branch => {
          return {
            coordinates: {
              latitude: branch.branch.latitude,
              longitude: branch.branch.longitude
            },
            title: `$${branch.price.listPrice} - ${branch.store.name}`,
            snippet: `${branch.branch.name}, ${branch.branch.province.name} | a ${branch.distanceKm.toFixed(2)} km`,
            icon: image ? image : undefined,
          }
        });
        setMarkersBranches(marksBranches);
        prevStoresId.current = [...storesId];
      } 
    } catch (error) {
      console.log('error loadBranchesByLocation: ', error);
    } finally {
      showSpinnerModal(false);
    }
  }

  const zoomLevelsByDistance = () => {
    switch (distance) {
      case 1:
        setZoom(14);
        centerOnCurrentLocation()
        break;
      
      case 2.5:
        setZoom(13);
        centerOnCurrentLocation()
        break;
      
      case 5:
        setZoom(12);
        centerOnCurrentLocation()
        break;

      case 10:
        setZoom(11);
        centerOnCurrentLocation()
        break;
      
      case 20:
        setZoom(10);
        centerOnCurrentLocation()
        break;
      
      case 40:
        setZoom(9);
        centerOnCurrentLocation()
        break;

      case 80:
        setZoom(8);
        centerOnCurrentLocation()
        break;

      case 160:
        setZoom(7);
        centerOnCurrentLocation()
        break;

      case 320:
        setZoom(6);
        centerOnCurrentLocation()
        break;
      
      case 640:
        setZoom(5);
        centerOnCurrentLocation()
        break;
      
      case 900:
        setZoom(4);
        centerOnCurrentLocation()
        break;
    
      default:
        break;
    }
  }

  const handleCloseMenuStore = () => {
    const isSame = storesId.length === prevStoresId.current.length && 
                   storesId.every(id => prevStoresId.current.includes(id));
    
    if (!isSame) {
      loadBranchesByLocation();
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadBranchesByLocation()
      zoomLevelsByDistance()
    } else {
      setDistance(2.5)
      setStoresId([]);
      return;
    } 

    if(!locationSubscription.current) startLocationTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, [isOpen, distance]);

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
    currentLocation,
    zoom,
    distance,
    distances,
    locationSelected,
    storesId,
    selectedStoresName,
    markersbranches,
    pushStoresId,
    setDistance,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
    loadBranchesByLocation,
    handleCloseMenuStore
  }
}