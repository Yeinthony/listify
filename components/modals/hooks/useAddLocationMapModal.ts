import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { Marker, Location as LocationParams, PushLocationParams } from "@/store/types/manage-location.store";
import { AddressSuggestion } from "@/api/types/geocoding";
import { reverseGeocode } from "@/api/geocoding.api";
import { ModalProps } from "../types/modal";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerLocation } from "@/utils/formSchemes";
import { useUserStore } from "@/store/userStore";

import MapView, { Region } from "react-native-maps";
import * as Location from "expo-location";
import useSnackbarStore from "@/store/snackbarStore";
import useManageLocationsStore from "@/store/manageLocationsStore";

type UseAddLocationMapModalProps = ModalProps & { location?: LocationParams };

export const useAddLocationsMapModal = ({ isOpen, onClose, location }: UseAddLocationMapModalProps) => {
  const { t } = useTranslation();
  const { user } = useUserStore()
  const { pushLocation, updateLocation } = useManageLocationsStore()
  const isEdit = !!location?.id
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
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false)
  const [center, setCenter] = useState<Marker | null>(null)

  const mapRef = useRef<MapView>(null);
  const markerLocation = useRef<Marker>({ latitude: 0, longitude: 0 })
  const isManualUpdate = useRef<boolean>(true)

  const { data: reverseAddress, isFetching: isLocating } = useQuery({
    queryKey: ['geocode-reverse', center?.latitude, center?.longitude],
    queryFn: ({ signal }) => reverseGeocode(center!.latitude, center!.longitude, signal),
    enabled: !!center,
    staleTime: 1000 * 60 * 60,
  })

  useEffect(() => {
    if (reverseAddress?.label) setValue("address", reverseAddress.label)
  }, [reverseAddress, setValue])

  useEffect(() => {
    if (isOpen && location) {
      setValue("title", location.name)
      setValue("address", location.address ?? "")
      setValue("latitude", `${location.latitude}`)
      setValue("longitude", `${location.longitude}`)
    }
  }, [isOpen, location, setValue])

  const centerOnInitial = async () => {
    if (!location) {
      centerOnCurrentLocation()
      return
    }
    const camera = await mapRef.current?.getCamera();
    if (!camera) return;
    isManualUpdate.current = false
    mapRef.current?.animateCamera({
      ...camera,
      center: { latitude: location.latitude, longitude: location.longitude },
    });
  }

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

  const onSelectAddress = async (suggestion: AddressSuggestion) => {
    setValue("address", suggestion.label)
    setValue("latitude", `${suggestion.latitude}`)
    setValue("longitude", `${suggestion.longitude}`)

    const camera = await mapRef.current?.getCamera();
    if (!camera) return;

    isManualUpdate.current = false
    mapRef.current?.animateCamera({
      ...camera,
      center: {
        latitude: suggestion.latitude,
        longitude: suggestion.longitude,
      },
    });
  }

  const handlerRegionChangeComplete = (region: Region) => {
    if(isManualUpdate.current){
      setValue("latitude", `${region.latitude}`)
      setValue("longitude", `${region.longitude}`)
    }else isManualUpdate.current = true
    setCenter({
      latitude: Math.round(region.latitude * 1e5) / 1e5,
      longitude: Math.round(region.longitude * 1e5) / 1e5,
    })
    setIsMarkerMove(false)
  }
  
  const handleClose = () => {
    onClose()
    reset()
    setCenter(null)
  }
  
  const createLocation = async() => {
    if (isEdit && location?.id) {
      updateLocation({
        id: location.id,
        data: {
          name: getValues('title'),
          address: getValues('address') || undefined,
          latitude: Number(getValues('latitude')),
          longitude: Number(getValues('longitude')),
        },
        snackbar: showSnackbar,
        spinner: showSpinnerModal,
        onSuccess: handleClose
      })
      return
    }

    const payload: PushLocationParams = {
      location: {
        userId: user?.id || "",
        name: getValues('title'),
        address: getValues('address') || undefined,
        latitude: Number(getValues('latitude')),
        longitude: Number(getValues('longitude')),
      },
      snackbar: showSnackbar,
      spinner: showSpinnerModal,
      onSuccess: handleClose
    }
    pushLocation(payload)
  }
  
  const onSubmit = handleSubmit(async(data) => {
    setShowAlertModal(true)
  })

  return {
    t,
    insets,
    markerLocation,
    mapRef,
    isMarkerMove,
    errors,
    control,
    showAlertModal,
    setShowAlertModal,
    setIsMarkerMove,
    addressLabel: reverseAddress?.label,
    isLocating,
    isEdit,
    centerOnCurrentLocation,
    centerOnInitial,
    onSelectAddress,
    onSubmit,
    handlerRegionChangeComplete,
    handleClose,
    createLocation
  }
}