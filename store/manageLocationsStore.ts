import { create } from "zustand";
import { ManageLocationsState } from "./types/manage-location.store";
import { locationsByUserId } from "@/api/user.api";
import { useUserStore } from "./userStore";

const useManageLocationsStore = create<ManageLocationsState>((set) => ({
  locations: [],
  setLocation: async(newLocation) => {

  },
  loadLocations: async (setLoading) => {
    try {
      setLoading(true)

      const user = useUserStore.getState().user;
      if (!user?.id) return;

      const res = await locationsByUserId(user.id)

      if (res.status === 200) {
        set({locations: res.data})
      }
      
    } catch (error) {
      console.log('error load locations: ', error);
    } finally {
      setLoading(false)
    }
  }
}))

export default useManageLocationsStore