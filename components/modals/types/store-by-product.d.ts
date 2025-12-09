import { Store } from "@/types/products";
import { ModalProps } from "./modal";

export interface StoreByProductProps {
  ean:    string;
  store:  Store | null;
  isOpen: boolean
  location: Loc;
}

export interface Loc {
  lat: number;
  lng: number;
}

export type StoreByProductModalProps = ModalProps & StoreByProductProps