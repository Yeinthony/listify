export type Channel = 'minorista' | 'mayorista';

export interface NearbyBranchesProps {
  ean:       string;
  body: {
    lat:  number;
    lng: number;
    km:  number;
    storeId?: string[];
    channel?: Channel;
  }
}

export interface Bounds { x: number; y: number; width: number; height: number }