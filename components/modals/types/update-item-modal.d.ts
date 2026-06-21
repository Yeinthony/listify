import { ListItem } from "@/types/shopping-lists";
import { UpdateItemPayload } from "@/api/types/shopping-lists";

export interface UpdateItemModalProps {
  isOpen: boolean;
  item: ListItem | null;
  onClose: () => void;
  onSave: (data: UpdateItemPayload) => Promise<unknown>;
  saving?: boolean;
}
