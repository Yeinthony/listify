import { create } from "zustand";
import { ManageLocationsState } from "./types/manage-location.store";
import { createLocation, locationsByUserId } from "@/api/user.api";
import { useUserStore } from "./userStore";

const useManageLocationsStore = create<ManageLocationsState>((set) => ({
  locations: [],
  loadLocations: async (setLoading) => {
    try {
      setLoading(true)

      const user = useUserStore.getState().user;
      if (!user?.id) return;

      const res = await locationsByUserId(user.id)

      if (res.status === 200) {
        set({locations: res.data})
        console.log('locations: ', res.data);
        
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
        snackbar({
          message: "Ubicación guardada con éxito",
          type: "success"
        })
        onSuccess()
      }
    } catch (error) {
      console.log('error: ', error);
    } finally {
      spinner(false)
    }
  }
}))

export default useManageLocationsStore