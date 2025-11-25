export interface ProductAll {
  product: Product
  availableStores: Store[]
  stats: Stats
}

export interface ProductLight {
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

export interface Availability {
  store: Store
  branches: Branch[]
}

export interface Store {
  id: string
  name: string
  cuit: string
  brandId: number
  logoUrl: string
  website: string
}

export interface Branch {
  branch: Branch2
  price: Price
}

export interface Branch2 {
  id: string
  name: string
  type: string
  locality: string
  latitude: number
  longitude: number
}

export interface Price {
  listPrice: string
  referencePrice: string
  promo1Price: any
  promo1Legend: any
  promo2Price: any
  promo2Legend: any
  unitPriceNormalized: string
  currency: string
}

export interface Stats {
  min: string
  max: string
  avg: string
}