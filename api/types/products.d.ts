import { Product, Stats } from "@/types/products";

export interface StoreByProductApiProps {
  ean:      string;
  storeId:  string;
}

export interface NearbyBranchesProps {
  ean:       string;
  lat:  number;
  lng: number;
  km:  number;
  storeId?: string[];
}

export interface Bounds { x: number; y: number; width: number; height: number }