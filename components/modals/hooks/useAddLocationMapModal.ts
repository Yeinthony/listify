import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRef, useState } from "react";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { Marker, Location as LocationParams, PushLocationParams } from "@/store/types/manage-location.store";
import { ModalProps } from "../types/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerLocation } from "@/utils/formSchemes";
import { createLocation } from "@/api/user.api";
import { useUserStore } from "@/store/userStore";

import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import useSnackbarStore from "@/store/snackbarStore";
import useManageLocationsStore from "@/store/manageLocationsStore";

export const useAddLocationsMapModal = ({ isOpen, onClose }: ModalProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore()
  const { locations, pushLocation } = useManageLocationsStore()
  const { showSnackbar } = useSnackbarStore()
  const insets = useSafeAreaInsets();
  const showSpinnerModal = useSpinnerModal();

  const { control, formState: { errors }, handleSubmit, reset, setValue, getValues } = useForm({
    resolver: zodResolver(registerLocation(t)),
    defaultValues: {
      title: '',
      latitude: '',
      longitude: ''
    },
  });

  const [isMarkerMove, setIsMarkerMove] = useState<boolean>(false)
  
  const mapRef = useRef<MapView>(null);
  const markerLocation = useRef<Marker>({ latitude: 0, longitude: 0 })
  const timeoutLatRef = useRef<number | null>(null);
  const timeoutLngRef = useRef<number | null>(null);
  const isManualUpdate = useRef<boolean>(true)

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

      mapRef.current?.animateCamera({
        ...camera,
        center: coords,
      });

    } catch (error) {
      console.error('Error al obtener ubicación actual:', error);
    }
  };

  const handlerRegionChangeComplete = (region: Region) => {
    if(isManualUpdate.current){
      setValue("latitude", `${region.latitude}`)
      setValue("longitude", `${region.longitude}`)
    }else isManualUpdate.current = true
    setIsMarkerMove(false)
  }
  
  const handleClose = () => {
    onClose()
    reset()
  }
  
  const onChangeLat = async(newLat: string) => {
    const camera = await mapRef.current?.getCamera();
    if (!camera) return;
    
    if(timeoutLatRef.current) clearTimeout(timeoutLatRef.current)
      isManualUpdate.current = false
    
    const latitude = Number(newLat)
    const longitude = Number(getValues('longitude'))
    
    timeoutLatRef.current = setTimeout(() => {
      mapRef.current?.animateCamera({
        ...camera,
        center: {
          latitude: latitude,
          longitude: longitude
        },
      });
    }, 3000);
  }
  
  const onChangeLng = async(newLng: string) => {
    const camera = await mapRef.current?.getCamera();
    if (!camera) return;
    
    if(timeoutLngRef.current) clearTimeout(timeoutLngRef.current)
      isManualUpdate.current = false
    
    const latitude = Number(getValues('latitude'))
    const longitude = Number(newLng)
    
    timeoutLngRef.current = setTimeout(() => {
      mapRef.current?.animateCamera({
        ...camera,
        center: {
          latitude: latitude,
          longitude: longitude
        },
      });
    }, 3000);
  }

  const createLocation = async() => {
    const payload: PushLocationParams = {
      location: {
        id: user?.id || "",
        name: getValues('title'), 
        address: getValues('address') || "",
        latitude: Number(getValues('latitude')),
        longitude: Number(getValues('longitude')),
      },
      snackbar: showSnackbar,
      spinner: showSpinnerModal
    }
    pushLocation(payload)
  }
  
  const onSubmit = handleSubmit(async(data) => {
    console.log('data: ', data);
  })

  return {
    t,
    insets,
    markerLocation,
    mapRef,
    isMarkerMove,
    errors,
    control,
    setIsMarkerMove,
    centerOnCurrentLocation,
    onSubmit,
    onChangeLat,
    onChangeLng,
    handlerRegionChangeComplete,
    handleClose
  }
}