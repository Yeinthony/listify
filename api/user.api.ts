import axios from '@/utils/interceptor'
import { RegisterUser, User } from '@/types/users' 
import { AxiosError, AxiosResponse } from 'axios'
import { RegisterResponse } from '@/types/api/user-api'

const URL = `${process.env.EXPO_PUBLIC_API_URL}/users`

export const register = async(user: RegisterUser): Promise<AxiosResponse<RegisterResponse>> => {
  try {
    const response = await axios.post<RegisterResponse>(`${URL}/create`, user)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}