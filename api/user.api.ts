import { RegisterUser, User, VerifyCode } from '@/types/users';
import { AxiosResponse } from 'axios';
import { Location } from '@/store/types/manage-location.store';
import http from '@/utils/httpClient';

export const register = (user: RegisterUser): Promise<AxiosResponse<User>> =>
  http.post<User>('/users/register', user);

export const verifyUser = (verifyData: VerifyCode): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/users/verify', verifyData);

export const resendUserCode = (data: { email: string }): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/users/resend-code', data);

export const locationsByUserId = (userId: string): Promise<AxiosResponse<Location[]>> =>
  http.get<Location[]>(`/users/list-locations?userId=${userId}`);

export const createLocation = (location: Location): Promise<AxiosResponse<Location>> =>
  http.post<Location>('/users/create-location', location);
