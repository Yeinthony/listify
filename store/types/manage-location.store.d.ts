import { ActionDeps } from "@/types/action-deps";

export interface Location {
  userId: string;
  name: string; 
  address?: string;
  latitude: number;
  longitude: number;
}

export interface Marker {
 latitude: number;
  longitude: number
}

export interface PushLocationParams extends ActionDeps {
  location: Location,
  onSuccess: () => void
}

export interface ManageLocationsState {
  locations: Location[]
  pushLocation: (locationParams: PushLocationParams) => void
  loadLocations: (setLoading: (loading: boolean) => void) => void
}