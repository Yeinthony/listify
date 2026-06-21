export interface QuantityPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (quantity: number) => void;
  confirming?: boolean;
}
