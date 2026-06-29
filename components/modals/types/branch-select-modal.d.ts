import { BranchPriceEntry } from "@/types/shopping-lists";

export interface BranchSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: BranchPriceEntry[];
  bestBranchId?: string | null;
  chosenId?: string | null;
  onSelect: (branch: BranchPriceEntry) => void;
}
