import { ListItem } from "@/types/shopping-lists";

export interface ListItemCardProps {
  item: ListItem;
  canEdit: boolean;
  onEdit: () => void;
  onRemove: () => void;
}
