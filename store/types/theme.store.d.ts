export type ThemeMode = 'system' | 'light' | 'dark';

export interface ThemeState {
  theme: ThemeMode
  setTheme: (newTheme: ThemeMode) => void
  loadTheme: () => void
}