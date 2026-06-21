import { CreateListPayload } from "@/api/types/shopping-lists";

export interface CreateListModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (payload: CreateListPayload) => Promise<unknown>;
  creating?: boolean;
}
