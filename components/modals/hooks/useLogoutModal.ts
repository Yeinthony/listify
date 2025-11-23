import { useState } from "react"
import { useUserStore } from "@/store/userStore"
import { useSpinnerModal } from "@/contexts/SpinnerModalContext"

export const useLogoutModal = () => {
  const { logoutSession } = useUserStore()
  const showSpinnerModal = useSpinnerModal()

  const onLogout = async() => {
    logoutSession({spinner: showSpinnerModal})
  }

  return {
    onLogout
  }
}