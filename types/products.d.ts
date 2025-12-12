export interface ProductAll {
  product: Product
  availableStores: Store[]
  stats: Stats
}

export interface ProductLight {
  product: Product
  stats: Stats
}

export interface NearbyBranch {
  branch: Branch
  price: Price
  store: {
    id: string
    name: string
  }
  distanceKm: number
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

export interface Store {
  id: string
  name: string
  cuit: string
  brandId: number
  logoUrl: string
  website: string
}

export interface Stats {
  min: string
  max: string
  avg: string
}

export interface PriceBranchByProduct {
  branch: Branch
  price: Price
}

export interface Branch {
  id: string
  storeId: string
  sepaId: number
  name: string
  type: string
  street: string
  number: string
  latitude: number
  longitude: number
  observations: string
  neighborhood: string
  postalCode: string
  locality: string
  schedules: Schedules
  createdAt: string
  updatedAt: string
  province: Province
}

export interface Schedules {
  friday: string
  monday: string
  sunday: string
  tuesday: string
  saturday: string
  thursday: string
  wednesday: string
}

export interface Province {
  code: string
  name: string
  description: any
  country: string
  createdAt: string
}

export interface Price {
  id: string
  productId: string
  branchId: string
  listPrice: string
  referencePrice: string
  promo1Price: any
  promo1Legend: any
  promo2Price: any
  promo2Legend: any
  unitPriceNormalized: string
  currency: string
  updatedAt: string
  createdAt: string
}