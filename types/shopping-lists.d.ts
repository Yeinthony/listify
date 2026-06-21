import { Product } from "@/types/products";
import { Channel } from "@/api/types/products";

export type ListRole = 'reader' | 'editor' | 'owner';

export interface OwnerPublic {
  id: string;
  email: string;
  username: string;
}

export interface ShoppingList {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  isPublic: boolean;
  totalEst: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatedList extends ShoppingList {
  myRole: ListRole;
}

export interface ListItem {
  id: string;
  listId: string;
  productId: string;
  quantity: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface ListCollaborator {
  id: string;
  listId: string;
  userId: string;
  role: ListRole;
  createdAt: string;
  updatedAt: string;
  user: OwnerPublic;
}

export interface ListSummary extends ShoppingList {
  owner: OwnerPublic;
  myRole: ListRole;
  itemCount: number;
}

export interface ListDetail extends ShoppingList {
  owner: OwnerPublic;
  myRole: ListRole;
  items: ListItem[];
  collaborators: ListCollaborator[];
}

export interface PlannedItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AppliedDiscount {
  id: string;
  percent: number;
  amount: number;
  paymentMethod: string;
}

export interface PlannedStore {
  branchId: string;
  storeId: string;
  storeName: string;
  distanceMeters: number;
  items: PlannedItem[];
  subtotal: number;
  appliedDiscount: AppliedDiscount | null;
  subtotalWithDiscount: number;
}

export interface NotCoveredItem {
  productId: string;
  name?: string;
}

export interface SingleStoreBest {
  branchId: string;
  totalCost: number;
}

export interface OptimizeResult {
  stores: PlannedStore[];
  totalCost: number;
  singleStoreBest: SingleStoreBest | null;
  savings: number;
  coveredItems: number;
  notCovered: NotCoveredItem[];
}

export interface BranchPriceItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface BranchPriceEntry {
  branchId: string;
  storeId: string;
  storeName: string;
  brandId: number;
  branchName: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  distanceMeters: number;
  coveredItems: number;
  total: number;
  appliedDiscount: AppliedDiscount | null;
  totalWithDiscount: number;
  items: BranchPriceItem[];
}

export interface ListBranchPrices {
  channel: Channel;
  currency: 'ars' | 'all' | 'usd';
  totalItems: number;
  branches: BranchPriceEntry[];
}
