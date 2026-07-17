import { PlannedStore } from "@/types/shopping-lists";

export interface PlannedStoreDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  store: PlannedStore | null;
  productNameById: Record<string, string>;
  totalItems: number;
}
