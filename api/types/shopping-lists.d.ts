import { Channel } from "@/api/types/products";
import { ListRole } from "@/types/shopping-lists";

export type Currency = 'ars' | 'all' | 'usd';
export type ExchangeType = 'blue' | 'oficial' | 'mep' | 'ccl';

export interface CreateListPayload {
  name: string;
  description?: string;
  isPublic?: boolean;
}

export interface UpdateListPayload {
  name?: string;
  description?: string;
  isPublic?: boolean;
}

export interface AddItemPayload {
  productId: string;
  quantity?: number;
  notes?: string;
}

export interface UpdateItemPayload {
  quantity?: number;
  notes?: string;
}

export interface OptimizePayload {
  lat: number;
  lng: number;
  km: number;
  maxStores?: number;
  channel?: Channel;
  applyDiscounts?: boolean;
  currency?: Currency;
  exchangeType?: ExchangeType;
}

export interface AddCollaboratorPayload {
  email: string;
  role: ListRole;
}

export interface UpdateCollaboratorRolePayload {
  role: ListRole;
}
