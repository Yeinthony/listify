export interface StoreOption {
  storeId: string;
  name: string;
}

export interface StoreSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  stores: StoreOption[];
  selectedStoreId: string | null;
  onSelect: (storeId: string | null) => void;
}
