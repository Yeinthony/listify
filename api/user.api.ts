import { email } from 'zod';
import axios from '@/utils/interceptor'
import { RegisterUser, User, VerifyCode } from '@/types/users' 
import { AxiosError, AxiosResponse } from 'axios'
import { Location } from '@/store/types/manage-location.store';

const URL = `${process.env.EXPO_PUBLIC_API_URL}/users`

export const register = async(user: RegisterUser): Promise<AxiosResponse<User>> => {
  try {
    const response = await axios.post<User>(`${URL}/create`, user)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const verifyUser = async(verifyData: VerifyCode): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.post<{message: string}>(`${URL}/verify`, verifyData)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const resendUserCode = async(data: {email: string}): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.post<{message: string}>(`${URL}/resend-code`, data)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const locationsByUserId = async(userId: string): Promise<AxiosResponse<Location[]>> => {
  try {
    const response = await axios.get<Location[]>(`${URL}/list-locations?userId=${userId}`)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const createLocation = async(location: Location): Promise<AxiosResponse<Location>> => {
  try {
    const response = await axios.post<Location>(`${URL}/create-location`, location)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}