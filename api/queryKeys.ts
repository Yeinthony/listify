import { Channel } from './types/products';
import { BranchChannel } from './types/shopping-lists';

const roundCoord = (n: number) => Math.round(n * 1000) / 1000;

interface NearbyParams {
  lat: number;
  lng: number;
  km: number;
  channel: Channel;
  storeId?: string[];
}

export const productKeys = {
  detail: (ean: string, params: { channel: Channel }) => ['product', ean, params] as const,
  light: (ean: string) => ['product-light', ean] as const,
  nearby: (ean: string, params: NearbyParams) =>
    ['nearby-prices', ean, { ...params, lat: roundCoord(params.lat), lng: roundCoord(params.lng) }] as const,
  search: (search: string) => ['products-search', search] as const,
};

interface BranchPricesKeyParams {
  lat: number;
  lng: number;
  km: number;
  channel: BranchChannel;
  limit: number | 'all';
}

export const userKeys = {
  search: (term: string) => ['users-search', term] as const,
};

export const shoppingListKeys = {
  list: (page = 1) => ['shopping-lists', page] as const,
  detail: (id: string) => ['shopping-list', id] as const,
  collaborators: (id: string) => ['shopping-list', id, 'collaborators'] as const,
  branchPrices: (id: string, params: BranchPricesKeyParams) =>
    ['shopping-list', id, 'branch-prices', { ...params, lat: roundCoord(params.lat), lng: roundCoord(params.lng) }] as const,
};
