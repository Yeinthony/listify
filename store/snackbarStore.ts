import { SnackbarState } from '@/types/store/snackbar-store';
import { create } from 'zustand';

const useSnackbarStore = create<SnackbarState>((set) => ({
  isVisible: false,
  message: '',
  type: 'info',
  duration: 3000,

  showSnackbar: (message, type = 'info', duration = 3000) =>
    set({ isVisible: true, message, type, duration }),

  hideSnackbar: () =>
    set({ isVisible: false, message: '', type: 'info' }),
}));

export default useSnackbarStore;

// Opcional si querés acceder directo pero mantiene tipo:
export const snackbarStore = useSnackbarStore;