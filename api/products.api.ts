import { AxiosError, AxiosResponse } from 'axios'
import { ProductLight } from './types/products';
import axios from '@/utils/interceptor'

const URL = `${process.env.EXPO_PUBLIC_API_URL}/products`

export const getProductByEanLight = async(ean: string): Promise<AxiosResponse<ProductLight>> => {
  try {
    const response = await axios.get<ProductLight>(`${URL}/ean-light/${ean}`)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}