import { ListItem } from "@/types/shopping-lists";

export interface ListItemCardProps {
  item: ListItem;
  canEdit: boolean;
  unitPrice?: number | null;
  onEdit: () => void;
  onRemove: () => void;
}
