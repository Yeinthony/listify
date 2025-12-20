import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { Location as Locations, Marker } from "@/store/types/manage-location.store";
import { Loc } from "../types/store-by-product";
import { ModalProps } from "../types/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register2Scheme, registerLocation } from "@/utils/formSchemes";

import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import helpers from "@/utils/helpers";

export const useAddLocationsMapModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();

  const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    resolver: zodResolver(registerLocation(t)),
    defaultValues: {
      title: '',
      latitude: '',
      longitude: ''
    },
  });

  const [currentLocation, setCurrentLocation] = useState<Loc>({ lat: 0, lng: 0 });
  const [locationSelected, setLocationSelected] = useState(location);
  const [zoom, setZoom] = useState<number>(15)
  const [markerLocation, setMarkerLocation] = useState<Marker>({ latitude: 0, longitude: 0 })
  const [isMarkerMove, setIsMarkerMove] = useState<boolean>(false)
  
  const mapRef = useRef<MapView>(null);
  const markerLocationRef = useRef<Marker>({ latitude: 0, longitude: 0 })

  const centerOnCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permiso de ubicación denegado');
        return;
      }

      const camera = await mapRef.current?.getCamera();
      if (!camera) return;

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // 2️⃣ Movés la cámara del mapa
      mapRef.current?.animateCamera({
        ...camera,
        center: coords,
      });

    } catch (error) {
      console.error('Error al obtener ubicación actual:', error);
    }
  };

  const handlerRegionChangeComplete = (region: Region) => {
    setMarkerLocation({
      latitude: region.latitude,
      longitude: region.longitude
    })
    setValue("latitude", `${region.latitude}`)
    setValue("longitude", `${region.longitude}`)
    setIsMarkerMove(false)
  }

  const onSubmit = handleSubmit(async(data) => {
    console.log('data: ', data);
  })

  const handleClose = () => {
    onClose()
    reset()
  }
  
  return {
    t,
    insets,
    currentLocation,
    zoom,
    locationSelected,
    markerLocation,
    mapRef,
    markerLocationRef,
    isMarkerMove,
    errors,
    control,
    setIsMarkerMove,
    setMarkerLocation,
    centerOnCurrentLocation,
    onSubmit,
    handlerRegionChangeComplete,
    handleClose
  }
}