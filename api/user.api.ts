import axios from '@/utils/interceptor'
import { RegisterUser, User, VerifyUser } from '@/types/users' 
import { AxiosError, AxiosResponse } from 'axios'

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

export const verifyUser = async(verifyData: VerifyUser): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.post<{message: string}>(`${URL}/verify`, verifyData)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const resendUserCode = async(email: string): Promise<AxiosResponse<{message: string}>> => {
  try {
    const response = await axios.post<{message: string}>(`${URL}/resend-code`, email)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}