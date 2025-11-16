import { SigninProps, SigninResponse } from '@/types/api/auth-api';
import { AxiosError, AxiosResponse } from 'axios';
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