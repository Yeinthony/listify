import { useState } from "react"
import useThemeStore from "@/store/themeStore"
import { ThemeMode } from "@/store/types/theme.store"

export const useThemeModal = () => {
  const { setTheme, theme } = useThemeStore()
  const [selectedTheme, setSelectedTheme] = useState<ThemeMode>(theme)

  const handlerTheme = () => {
    if(selectedTheme !== theme) setTheme(selectedTheme)
  }

  return {
    selectedTheme,
    setSelectedTheme,
    handlerTheme
  }
}