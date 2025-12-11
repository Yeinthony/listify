import { Store } from "@/types/products";
import { ModalProps } from "./modal";
import { Loc } from "./store-by-product";

export interface BranchsMapModalProps extends ModalProps {
  location: Loc,
  availableStores: Store[],
  ean: string;
}

export interface useBranchsMapModalProps {
  isOpen: boolean;
  location: Loc;
  availableStores: Store[];
  ean: string;
}

export interface BranchMapMarker {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  title: string;
  snippet?: string;
  icon?: any;
}