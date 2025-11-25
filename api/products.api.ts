import { AxiosError, AxiosResponse } from 'axios'
import axios from '@/utils/interceptor'
import { ProductAll, ProductLight } from '@/types/products'

const URL = `${process.env.EXPO_PUBLIC_API_URL}/products`


export const getProductByEanAll = async(ean: string): Promise<AxiosResponse<ProductAll>> => {
  try {
    const response = await axios.get<ProductAll>(`${URL}/ean/${ean}`)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}

export const getProductByEanLight = async(ean: string): Promise<AxiosResponse<ProductLight>> => {
  try {
    const response = await axios.get<ProductLight>(`${URL}/ean-light/${ean}`)
    console.log(response);

    return response
  } catch (error) {
    return Promise.reject(error as AxiosError)
  }
}