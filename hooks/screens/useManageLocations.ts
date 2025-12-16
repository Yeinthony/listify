import { useEffect, useState } from "react"
import useManageLocationsStore from "@/store/manageLocationsStore"

export const useManageLocations = () => {
  const { locations, loadLocations } = useManageLocationsStore()

  const [loading, setLoading] = useState(false)
  const [showAddLocationModal, setShowAddLocationModal] = useState(false)

  useEffect(() => {
    if(locations.length === 0) loadLocations(setLoading)
  }, [])

  return {
    loading,
    locations,
    showAddLocationModal,
    setShowAddLocationModal
  }
}