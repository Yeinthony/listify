import { useEffect, useState } from "react"
import useManageLocationsStore from "@/store/manageLocationsStore"
import useSnackbarStore from "@/store/snackbarStore"
import { useSpinnerModal } from "@/contexts/SpinnerModalContext"
import { Location } from "@/store/types/manage-location.store"

export const useManageLocations = () => {
  const { locations, loadLocations, removeLocation } = useManageLocationsStore()
  const { showSnackbar } = useSnackbarStore()
  const showSpinnerModal = useSpinnerModal()

  const [loading, setLoading] = useState(false)
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null)

  useEffect(() => {
    if(locations.length === 0) loadLocations(setLoading)
  }, [])

  const closeLocationModal = () => {
    setShowAddLocationModal(false)
    setEditingLocation(null)
  }

  const confirmDelete = () => {
    if (!deletingLocation?.id) return
    removeLocation({
      id: deletingLocation.id,
      snackbar: showSnackbar,
      spinner: showSpinnerModal,
      onSuccess: () => setDeletingLocation(null)
    })
  }

  return {
    loading,
    locations,
    showAddLocationModal,
    setShowAddLocationModal,
    editingLocation,
    setEditingLocation,
    deletingLocation,
    setDeletingLocation,
    closeLocationModal,
    confirmDelete
  }
}
