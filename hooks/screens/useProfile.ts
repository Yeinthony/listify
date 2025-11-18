import { useState } from "react"

export const useProfile = () => {
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false)
  const [showLangModal, setShowLangModal] = useState<boolean>(false)
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false)

  return {
    showThemeModal,
    showLangModal,
    showLogoutModal,
    setShowThemeModal,
    setShowLangModal,
    setShowLogoutModal
  }
}