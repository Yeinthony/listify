import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { Location as Locations, Marker } from "@/store/types/manage-location.store";
import { Loc } from "../types/store-by-product";
import { ModalProps } from "../types/modal";

import * as Location from "expo-location";
import helpers from "@/utils/helpers";
import { Keyboard } from "react-native";
import { useImage } from "expo-image";

export const useAddLocationsMapModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();

  const image = useImage(require('@/assets/images/favorite-location.png'), {
    onError(error) {
      console.error('Loading failed:', error.message);
    }
  });

  const [currentLocation, setCurrentLocation] = useState<Loc>({ lat: 0, lng: 0 });
  const [locationSelected, setLocationSelected] = useState(location);
  const [zoom, setZoom] = useState<number>(15)
  const [markersLocations, setMarkersLocations] = useState<Marker[]>([])

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


  useEffect(() => {
    if(isOpen) {
      centerOnCurrentLocation()
      if(markersLocations.length === 0) {
        setMarkersLocations([
          {
            id: 'marker-1',
            coordinates: {
              latitude: -34.60926903688196, 
              longitude: -58.390340377259875
            },
            title: "Marcador",
            snippet: "descripcion",
            icon: image ? image : undefined,
            draggable: true
          }
        ])
      }
    } 
  }, [isOpen]);

  useEffect(() => {
    console.log('locations: ', markersLocations);
    
  }, [markersLocations])
  

  return {
    t,
    insets,
    currentLocation,
    zoom,
    locationSelected,
    markersLocations,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
  }
}