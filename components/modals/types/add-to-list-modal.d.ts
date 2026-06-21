export interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (listId: string) => void;
}
