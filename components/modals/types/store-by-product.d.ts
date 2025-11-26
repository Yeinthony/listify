import { Store } from "@/types/products";
import { ModalProps } from "./modal";

export interface StoreByProductProps {
  ean:      string;
  store:  Store | null;
  isOpen: boolean
}

export type StoreByProductModalProps = ModalProps & StoreByProductProps