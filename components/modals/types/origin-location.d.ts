import { Location } from "@/store/types/manage-location.store";
import { Loc } from "./store-by-product";

export type SavedLocation = Location & { id: string };

export interface UseOriginLocationProps {
  isOpen: boolean;
  fallback: Loc;
}

export interface OriginLocationMenuProps {
  locations: SavedLocation[];
  selectedId: string | null;
  originName: string;
  onSelect: (id: string) => void;
  onSelectMyLocation: () => void;
  onAddLocation: () => void;
  placement?: 'top' | 'bottom';
  className?: string;
}
