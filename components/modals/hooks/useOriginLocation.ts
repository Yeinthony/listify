import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { SavedLocation, UseOriginLocationProps } from "../types/origin-location";
import { Loc } from "../types/store-by-product";

import useManageLocationsStore from "@/store/manageLocationsStore";

export const useOriginLocation = ({ isOpen, fallback }: UseOriginLocationProps) => {
  const { t } = useTranslation();
  const { locations, loadLocations } = useManageLocationsStore();

  const [loadingLocations, setLoadingLocations] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showAddLocationModal, setShowAddLocationModal] = useState<boolean>(false);

  const wasAdding = useRef<boolean>(false);
  const previousCount = useRef<number>(locations.length);

  useEffect(() => {
    if (!isOpen) {
      setSelectedId(null);
      setShowAddLocationModal(false);
      wasAdding.current = false;
      return;
    }

    if (locations.length === 0) loadLocations(setLoadingLocations);
  }, [isOpen]);

  useEffect(() => {
    if (wasAdding.current && locations.length > previousCount.current) {
      const created = locations[locations.length - 1];
      if (created?.id) setSelectedId(created.id);
      wasAdding.current = false;
    }

    previousCount.current = locations.length;
  }, [locations]);

  const savedLocations = locations.filter(
    (location): location is SavedLocation => !!location.id
  );

  const selected = savedLocations.find(location => location.id === selectedId) ?? null;

  const origin: Loc = selected
    ? { lat: selected.latitude, lng: selected.longitude }
    : fallback;

  const originName = selected?.name ?? t('screen.origin-location.myLocation');

  const selectLocation = (id: string) => setSelectedId(id);

  const selectMyLocation = () => setSelectedId(null);

  const openAddLocation = () => {
    wasAdding.current = true;
    setShowAddLocationModal(true);
  };

  const closeAddLocation = () => setShowAddLocationModal(false);

  return {
    savedLocations,
    loadingLocations,
    selectedId,
    origin,
    originName,
    selectLocation,
    selectMyLocation,
    showAddLocationModal,
    openAddLocation,
    closeAddLocation
  };
};
