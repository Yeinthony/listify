import { Branch, Store } from "@/types/products";
import { ImageURISource } from "react-native";
import { ModalProps } from "./modal";
import { Loc } from "./store-by-product";

export interface BranchsMapModalProps extends ModalProps {
  location: Loc,
  availableStores: Store[],
  product: {
    name: string;
    ean: string;
  }
}

export interface useBranchsMapModalProps {
  isOpen: boolean;
  location: Loc;
  availableStores: Store[];
  ean: string;
}

export interface BranchMapMarker {
  id?: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description?: string;
  image?: ImageURISource | number;
  pinColor?: string;
}