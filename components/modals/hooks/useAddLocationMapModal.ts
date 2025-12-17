import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { Location as Locations } from "@/store/types/manage-location.store";
import { Loc } from "../types/store-by-product";
import { ModalProps } from "../types/modal";

import * as Location from "expo-location";
import helpers from "@/utils/helpers";
import { Keyboard } from "react-native";

export const useAddLocationsMapModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();

  const [currentLocation, setCurrentLocation] = useState<Loc>({ lat: 0, lng: 0 });
  const [locationSelected, setLocationSelected] = useState(location);
  const [zoom, setZoom] = useState<number>(15)
  const [showMap, setShowMap] = useState<boolean>(true)
  const [markersLocations, setMarkersLocations] = useState<Locations[]>([])

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

  const handlerClose = () => {
    if(showMap) {
      onClose()
    } else {
      Keyboard.dismiss();
      setShowMap(true)
    }
  }

  useEffect(() => {
    if(isOpen) centerOnCurrentLocation()
  }, [isOpen]);

  return {
    t,
    insets,
    currentLocation,
    zoom,
    locationSelected,
    markersLocations,
    showMap,
    setShowMap,
    zoomOn,
    zoomOut,
    centerOnCurrentLocation,
    handlerClose
  }
}