import { SigninProps, SigninResponse } from './types/auth-api';
import { AxiosError, AxiosResponse } from 'axios';
import { VerifyCode } from '@/types/users';
import axios from '@/utils/interceptor'

const URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`

export const login = async(data: SigninProps): Promise<AxiosResponse<SigninResponse>> => {
  try {
    const response = await axios.post<SigninResponse>(`${URL}/login`, data)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const whoami = async(): Promise<AxiosResponse<SigninResponse>> => {
  try {
    const response = await axios.get<SigninResponse>(`${URL}/whoami`)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const logout = async(): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await axios.post<{ message: string }>(`${URL}/logout`)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const sendPassCode = async(data: {email: string}): Promise<AxiosResponse<{ message: string }>> => {
  try {
    const response = await axios.post<{ message: string }>(`${URL}/send-password-code`, data)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const verifyPassCode = async(verifyData: VerifyCode): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.post<{message: string}>(`${URL}/verify-password-code`, verifyData)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const resendPassCode = async(data: {email: string}): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.post<{message: string}>(`${URL}/resend-password-code`, data)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const changePassword = async(changePassData: SigninProps): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.patch<{message: string}>(`${URL}/change-pass`, changePassData)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}
