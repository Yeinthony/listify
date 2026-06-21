import { Channel } from './types/products';

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
  nearby: (ean: string, params: NearbyParams) => ['nearby-prices', ean, params] as const,
};
