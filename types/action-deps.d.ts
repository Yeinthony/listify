import { useSpinnerModal } from "@/contexts/SpinnerModalContext";
import { SnackbarStoreFn } from "./store/snackbar-store";
import { TFunction } from "i18next";

export interface ActionDeps {
  spinner: ReturnType<typeof useSpinnerModal>;
  snackbar: ShowSnackbarFn;
}

export interface ActionDepsT extends ActionDeps {
  spinner: ReturnType<typeof useSpinnerModal>;
  snackbar: ShowSnackbarFn;
  t: TFunction
}