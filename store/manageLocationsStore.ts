import { create } from "zustand";
import { ManageLocationsState } from "./types/manage-location.store";
import { createLocation, locationsByUserId, updateLocation, deleteLocation } from "@/api/user.api";
import { useUserStore } from "./userStore";
import { ApiError } from "@/utils/apiError";

const useManageLocationsStore = create<ManageLocationsState>((set) => ({
  locations: [],
  loadLocations: async (setLoading) => {
    try {
      setLoading(true)

      const user = useUserStore.getState().user;
      if (!user?.id) return;

      const res = await locationsByUserId(user.id)

      if (res.status === 200) {
        set({locations: res.data.data})
      }
      
    } catch (error) {
      console.log('error load locations: ', error);
    } finally {
      setLoading(false)
    }
  },
  pushLocation: async(locationParams) => {
    const { location, snackbar, spinner, onSuccess } = locationParams

    try {
      spinner(true)

      const res = await createLocation(location)

      if(res.status === 200){
        set((state) => ({ locations: [...state.locations, res.data] }))
        snackbar({
          message: "Ubicación guardada con éxito",
          type: "success"
        })
        onSuccess()
      }
    } catch (error) {
      snackbar({
        message: error instanceof ApiError ? error.message : "No se pudo guardar la ubicación",
        type: "error"
      })
    } finally {
      spinner(false)
    }
  },
  updateLocation: async ({ id, data, snackbar, spinner, onSuccess }) => {
    try {
      spinner(true)

      const res = await updateLocation(id, data)

      if (res.status === 200) {
        set((state) => ({
          locations: state.locations.map((l) => (l.id === id ? res.data : l))
        }))
        snackbar({
          message: "Ubicación actualizada con éxito",
          type: "success"
        })
        onSuccess()
      }
    } catch (error) {
      snackbar({
        message: error instanceof ApiError ? error.message : "No se pudo actualizar la ubicación",
        type: "error"
      })
    } finally {
      spinner(false)
    }
  },
  removeLocation: async ({ id, snackbar, spinner, onSuccess }) => {
    try {
      spinner(true)

      const res = await deleteLocation(id)

      if (res.status === 200) {
        set((state) => ({
          locations: state.locations.filter((l) => l.id !== id)
        }))
        snackbar({
          message: res.data?.message ?? "Ubicación eliminada",
          type: "success"
        })
        onSuccess?.()
      }
    } catch (error) {
      snackbar({
        message: error instanceof ApiError ? error.message : "No se pudo eliminar la ubicación",
        type: "error"
      })
    } finally {
      spinner(false)
    }
  }
}))

export default useManageLocationsStore