import { useTranslation } from "react-i18next";
import { BranchMapMarker, useBranchsMapModalProps } from "../types/branchs-map"; 
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { DISTANCES_FILTER } from "@/assets/globalsConst";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { getNearbyBranches } from "@/api/products.api";
import * as Location from "expo-location";
import helpers from "@/utils/helpers";

export const useBranchsMapModal = ({ isOpen, location, availableStores, ean }: useBranchsMapModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();

  const [currentLocation, setCurrentLocation] = useState(location);
  const [locationSelected, setLocationSelected] = useState(location);
  const [storesId, setStoresId] = useState<string[]>([]);
  const [selectedStoresName, setSelectedStoresName] = useState<string>("Todos los comercios");
  const [zoom, setZoom] = useState<number>(15)
  const [distance, setDistance] = useState<number>(5)
  const [markersbranches, setMarkersBranches] = useState<BranchMapMarker[]>([])

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
        lat: location.lat,
        lng: location.lng,
        km: distance,
        ...(storesId.length > 0 && { storeId: storesId })
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
            title: `${branch.branch.name} - $${branch.price.listPrice}`,
            snippet: `${branch.branch.name}, ${branch.branch.province.name} | a ${branch.distanceKm.toFixed(2)} km`,
            //icon: require("@/assets/images/store.png"),
          }
        });
        setMarkersBranches(marksBranches);
      } 
    } catch (error) {
      console.log('error loadBranchesByLocation: ', error);
    } finally {
      showSpinnerModal(false);
    }
  }

  useEffect(() => {
    if (isOpen) {
      loadBranchesByLocation()
    } else {
      setDistance(5)
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
    loadBranchesByLocation
  }
}