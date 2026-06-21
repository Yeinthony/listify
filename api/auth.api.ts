import { SigninProps, SigninResponse } from './types/auth-api';
import { AxiosResponse } from 'axios';
import { VerifyCode } from '@/types/users';
import http from '@/utils/httpClient';

export const login = (data: SigninProps): Promise<AxiosResponse<SigninResponse>> =>
  http.post<SigninResponse>('/auth/login', data);

export const whoami = (): Promise<AxiosResponse<SigninResponse>> =>
  http.get<SigninResponse>('/auth/whoami');

export const logout = (): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/auth/logout');

export const sendPassCode = (data: { email: string }): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/auth/send-password-code', data);

export const verifyPassCode = (verifyData: VerifyCode): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/auth/verify-password-code', verifyData);

export const resendPassCode = (data: { email: string }): Promise<AxiosResponse<{ message: string }>> =>
  http.post<{ message: string }>('/auth/resend-password-code', data);

export const changePassword = (changePassData: SigninProps): Promise<AxiosResponse<{ message: string }>> =>
  http.patch<{ message: string }>('/auth/change-pass', changePassData);
