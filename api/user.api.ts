import { PublicUser, RegisterUser, User, VerifyCode } from '@/types/users';
import { AxiosResponse } from 'axios';
import { Location, LocationInput } from '@/store/types/manage-location.store';
import { Paginated } from './types/common';
import http from '@/utils/httpClient';

export const register = (user: RegisterUser): Promise<AxiosResponse<User>> =>
  http.post<User>('/users/register', user);

export const verifyUser = (verifyData: VerifyCode): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/users/verify', verifyData);

export const resendUserCode = (data: { email: string }): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/users/resend-code', data);

export const locationsByUserId = (userId: string): Promise<AxiosResponse<Paginated<Location>>> =>
  http.get<Paginated<Location>>(`/users/list-locations?userId=${userId}`);

export const createLocation = (location: Location): Promise<AxiosResponse<Location>> =>
  http.post<Location>('/users/create-location', location);

export const updateLocation = (id: string, data: LocationInput): Promise<AxiosResponse<Location>> =>
  http.patch<Location>(`/users/locations/${id}`, data);

export const deleteLocation = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  http.delete<{ message: string }>(`/users/locations/${id}`);

export const searchUsers = (term: string): Promise<AxiosResponse<PublicUser[]>> =>
  http.get<PublicUser[]>(`/users/search?search=${encodeURIComponent(term)}`);
