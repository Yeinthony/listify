import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { SnackbarStoreFn } from "./store/snackbar-store";

export interface ActionDeps {
  spinner: ReturnType<typeof useSpinnerModal>;
  snackbar: ShowSnackbarFn;
}