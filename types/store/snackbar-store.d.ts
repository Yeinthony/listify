import { SnackbarType } from "../components/generals/snackbar";

interface ShowSnackbarParams {
  message: string;
  type?: SnackbarType;
  duration?: number;
}

export interface ShowSnackbarFn {
  (props: ShowSnackbarParams): void;
}

export interface SnackbarState {
  isVisible: boolean;
  message: string;
  type: SnackbarType;
  duration: number;
  showSnackbar: ShowSnackbarFn;
  hideSnackbar: () => void;
}
