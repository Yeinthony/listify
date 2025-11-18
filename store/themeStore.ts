import { create } from "zustand";
import { Platform } from 'react-native';
import { ThemeState, ThemeMode } from "./types/theme.store";
import * as SecureStore from 'expo-secure-store';

const useThemeStore = create<ThemeState>((set) => ({
  theme: 'system',
  setTheme: async(newTheme) => {
    set({ theme: newTheme })
    await SecureStore.setItemAsync('userTheme', newTheme)
  },
  loadTheme: async () => {
    const savedTheme = await SecureStore.getItemAsync('userTheme')
    if(savedTheme) set({ theme: savedTheme as ThemeMode })
  }
}))

export default useThemeStore