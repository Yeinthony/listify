import { ListSummary } from "@/types/shopping-lists";

export interface ListCardProps {
  list: ListSummary;
  onPress: () => void;
  onDelete?: () => void;
}
