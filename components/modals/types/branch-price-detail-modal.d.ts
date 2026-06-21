import { BranchPriceEntry } from "@/types/shopping-lists";

export interface BranchPriceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: BranchPriceEntry | null;
  productNameById: Record<string, string>;
  totalItems: number;
}
