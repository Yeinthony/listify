export interface LightProduct {
  product: Product
  stats: Stats
}

export interface Product {
  id: string
  ean: string
  name: string
  brand: string
  imageUrl: any
  presentationQty: number
  presentationUnit: string
}

export interface Stats {
  min: string
  max: string
  avg: string
}