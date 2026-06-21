import { AxiosResponse } from 'axios';
import http from '@/utils/httpClient';
import { NearbyBranch, ProductAll, ProductLight } from '@/types/products';
import { NearbyBranchesProps } from './types/products';

export const getProductByEanAll = (ean: string): Promise<AxiosResponse<ProductAll>> =>
  http.get<ProductAll>(`/products/ean/${ean}`);

export const getProductByEanLight = (ean: string): Promise<AxiosResponse<ProductLight>> =>
  http.get<ProductLight>(`/products/ean-light/${ean}`);

export const getNearbyBranches = (data: NearbyBranchesProps): Promise<AxiosResponse<NearbyBranch[]>> =>
  http.post<NearbyBranch[]>(`/products/ean/${data.ean}/nearby-prices`, data.body);
